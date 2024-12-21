import prisma from "@/lib/prisma/prismaClient";
import { AddTaskData, TaskResult, TasksResult } from "@/app/api/main/task/types";
import {
  LimitExceededError,
  NotFoundError,
  SubscriptionError,
  UnauthorizedError,
} from "@/lib/error_handler/customerErrors";
import { UserRole, Departements } from "@prisma/client";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { updateTaskStatistics } from "@/app/api/main/statistics/statistics";

export async function addTask(
  data: AddTaskData,
  hotelId: string,
  userId: string,
  userRole: UserRole[]
): Promise<TaskResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const isAdmin = userRole.includes(UserRole.admin);

      // Parallel verification of hotel and user
      const hotel  = await 
        prisma.hotel.findUnique({
          where: { id: hotelId },
          select: {
            subscription: {
              select: {
                plan: {
                  select: {
                    maxTasks: true,
                  },
                },
              },
            },
            _count: { select: { task: true } },
            admin: {
              select: { id: true },
            },
          },
        })
       
      

      // Verify hotel and subscription
      if (!hotel) throw new NotFoundError("Hotel non trouvé");
      if (!hotel.subscription?.plan)
        throw new SubscriptionError("Hotel n'a pas de plan d'abonnement active");
      if (hotel._count.task >= hotel.subscription.plan.maxTasks) {
        throw new LimitExceededError(
          "Le nombre Maximum des taches pour ce plan est déja atteint"
        );
      }

      

      

      // Filter valid employee assignments
      const validEmployeeAssignments = data.employeeAssignedTask.filter(
        (ea) => ea.employeeId !== ""
      );

      // Create task
      const createdTask = await prisma.task.create({
        data: {
          title: data.title,
          description: data.description,
          deadline: new Date(data.deadline),
          
          hotel: { connect: { id: hotelId } },
          ...(isAdmin
            ? { createdByAdmin: { connect: { id: userId } } }
            : { createdByEmployee: { connect: { id: userId } } }),
          assignedEmployees: {
            create: validEmployeeAssignments.map((assignment) => ({
              employee: { connect: { id: assignment.employeeId } },
            })),
          },
        },
        select : {id : true,title : true,description : true,isDone : true,deadline : true,createdAt : true}
      });

      await updateTaskStatistics(hotelId, "add", prisma);
      return { Task: createdTask };
    });
  } catch (error) {
    throwAppropriateError(error);
  }
}

export async function getAllTasks(
  userId: string,
  
  userRole: UserRole[],
  hotelId: string,
): Promise<TasksResult> {
  try {
    const isAdmin = userRole.includes(UserRole.admin);

    const tasks = await prisma.task.findMany({
      where: {
        hotelId: hotelId,
        // Use ternary to set the correct ID field based on role
        ...(isAdmin 
          ? { createdByAdminId: userId }
          : { createdByEmployeeId: userId }
        ),
      },
      select :{
        title :true,
        description :true,
        isDone :true,
        deadline :true,
        createdAt :true,
        id :true,
        assignedEmployees :{select:{employee :{select:{id :true,firstName :true,lastName:true}}}}
      }
    });

    return { Tasks: tasks };
  } catch (error) {
    throwAppropriateError(error);
  }
}
/////////////////////////// functions //////////////////////////////////
export function checkRestaurantManagerReceptionManagerAdminRole(
  roles: UserRole[]
) {
  if (
    !roles.includes(UserRole.restaurent_Manager) &&
    !roles.includes(UserRole.admin) &&
    !roles.includes(UserRole.reception_Manager)
  ) {
    throw new UnauthorizedError(
      "Sauf restaurant manager, admin, et reception manager peut faire cette action"
    );
  }
}
