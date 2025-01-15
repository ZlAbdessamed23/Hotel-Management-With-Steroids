import prisma from "@/lib/prisma/prismaClient"; // Adjust the import path as needed
import {
  AddHouseKeepingPlanificationData,
  HouseKeepingPlanificationResult,
  HouseKeepingPlanificationsResult
} from "@/app/api/main/housekeeping/planification/types";
import {
  UnauthorizedError,
  NotFoundError,
  LimitExceededError,
  SubscriptionError,
  ValidationError,
} from "@/lib/error_handler/customerErrors"; // Adjust as needed
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { UserRole } from "@prisma/client";

export async function addHouseKeepingPlanification(
  data: AddHouseKeepingPlanificationData,
  hotelId: string
): Promise<HouseKeepingPlanificationResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
        const [hotel, HouseKeepingPlanificationCount] = await Promise.all([
            prisma.hotel.findUnique({
              where: { id: hotelId },
              include: {
                subscription: {
                  include: {
                    plan: true,
                  },
                },
              },
            }),
            prisma.houseKeepingPlanification.count({
              where: { hotelId },
            }),
          ]);
    
          if (!hotel) throw new ValidationError("Hotel non trouvé");
          if (!hotel.subscription?.plan)
            throw new SubscriptionError("Hotel n'a pas d'abonnement actif");
    
          const maxHouseKeepingPlanifications = hotel.subscription.plan.maxHouseKeepingPlanifications;
          if (HouseKeepingPlanificationCount >= maxHouseKeepingPlanifications) {
            throw new LimitExceededError(
              "Le nombre Maximum des planification pour ce plan est déja atteint"
            );
          }
      

      // Create the attendee
      const createdHouseKeepingPlanification = await prisma.houseKeepingPlanification.create({
        data: { ...data,hotelId },
        select : {
          id : true,
          description : true,
          end : true,
          title : true,
          start : true,
          
        }
      });

      return { HouseKeepingPlanification: createdHouseKeepingPlanification };
    });
  } catch (error) {
    throwAppropriateError(error);
  }
}
//////////////////// get ///////////////////////////////
export async function getAllHouseKeepingPlanifications(
    hotelId: string,
    
  ): Promise<HouseKeepingPlanificationsResult> {
    try {
      const HouseKeepingPlanifications = await prisma.houseKeepingPlanification.findMany({
        where: {
          hotelId: hotelId,
         
        },
        select : {
          id : true,
          description : true,
          end : true,
          title : true,
          start : true,
          
        }
       
      });
  
      return { HouseKeepingPlanifications };
    } catch (error) {
      throwAppropriateError(error);
    }
  }

export function checkReceptionManagerReceptionistGouvernementRole(roles: UserRole[]) {
  if (
     !roles.includes(UserRole.gouvernante)&&!roles.includes(UserRole.reception_Manager) &&
     !roles.includes(UserRole.receptionist)
  ) {
    throw new UnauthorizedError(
      "Sauf gouvernement manager peut faire cette action"
    );
  }
}

export function checkReceptionManagerReceptionistGouvernementAdminRole(roles: UserRole[]) {
    if (
      !roles.includes(UserRole.reception_Manager) &&
      !roles.includes(UserRole.receptionist)&& !roles.includes(UserRole.gouvernante)&& !roles.includes(UserRole.admin)
    ) {
      throw new UnauthorizedError(
        "Sauf receptionist , reception , gouvernement , admin peut faire cette action"
      );
    }
  }