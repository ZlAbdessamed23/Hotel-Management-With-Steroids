
import prisma from "@/lib/prisma/prismaClient";
import { AddClientData, ClientResult, ClientsResult } from "@/app/api/main/client/client/types";
import {
  ValidationError,
  
  LimitExceededError,
} from "@/lib/error_handler/customerErrors";
import { UserRole } from "@prisma/client";
import { throwAppropriateError } from "@/lib/error_handler/throwError";

export async function addClient(
  data: AddClientData,
  hotelId: string,
  employeeId: string
): Promise<ClientResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const [hotel, clientCount] = await Promise.all([
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
        prisma.client.count({ where: { hotelId } }),
      ]);

      if (!hotel) throw new ValidationError("hotel non trouvé");
      if (!hotel.subscription?.plan)
        throw new ValidationError("Hotel n'a pas d'abonnement actif");

      if (clientCount >= hotel.subscription.plan.maxClients) {
        throw new LimitExceededError(
          "Le nombre Maximum des clients pour ce plan est déja atteint"
        );
      }

      const newClient = await prisma.client.create({
        data: {
          ...data,
          hotelId,
          employeeId,
        },
        select : {
          fullName : true,
          address : true,
          email : true,
          phoneNumber : true,
          id : true,
          identityCardNumber : true,
          gender : true,
          dateOfBirth : true ,
          clientOrigin : true,
          kidsNumber : true,
          nationality : true,
          membersNumber : true,
          hotelId : true,
          createdAt : true,
          
        }
      });

      return { client: newClient };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

///////////////////  get all clients for both receptionist and admin /////////////////////////////
export async function getAllClients(hotelId: string): Promise<ClientsResult> {
  try {
    const clients = await prisma.client.findMany({
      where: { hotelId: hotelId },
      select : {
        fullName : true,
        address : true,
        email : true,
        phoneNumber : true,
        id : true,
        identityCardNumber : true,
        gender : true,
        dateOfBirth : true ,
        clientOrigin : true,
        kidsNumber : true,
        nationality : true,
        membersNumber : true,
        hotelId : true,
        createdAt : true,
        
      }
    });

    return { clients };
  } catch (error) {
    throwAppropriateError(error);
  }
}

/////////////////////////////// functions /////////////////////////////////////////

export function checkReceptionistReceptionManagerRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.receptionist) &&
    !roles.includes(UserRole.reception_Manager)
  ) {
    throw new ValidationError(
      "Sauf le réceptiontist et le réceptionist manager peut faire cette action"
    );
  }
}
export function checkReceptionistReceptionManagerAdminRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.receptionist) &&
    !roles.includes(UserRole.reception_Manager) &&
    !roles.includes(UserRole.admin)
  ) {
    throw new ValidationError(
      "Sauf le réceptiontist, le réceptionist manager et l'administrateur peut faire cette action"
    );
  }
}
