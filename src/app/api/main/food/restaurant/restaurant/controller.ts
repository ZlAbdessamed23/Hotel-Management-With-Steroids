import { LimitExceededError, SubscriptionError,NotFoundError, UnauthorizedError } from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { AddRestaurantData, RestaurantResult, RestaurantsResult } from "@/app/api/main/food/restaurant/restaurant/types";
import { UserRole } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient";

export async function addRestaurant(
    data: AddRestaurantData,
    hotelId: string,
    
  ): Promise<RestaurantResult> {
    try {
      return await prisma.$transaction(async (prisma) => {
        const hotel = await prisma.hotel.findUnique({
          where: { id: hotelId },
          select: {
            subscription: {
              select: {
                plan: {
                  select: {
                    maxRestaurants:true
                  },
                },
              },
            },
            _count: { select: { restaurant: true } },
            admin: {
              select: { id: true },
            },
          },
        });
  
        if (!hotel) throw new NotFoundError("Hotel non trouvée");
        if (!hotel.subscription?.plan)
          throw new SubscriptionError("Hotel n'a pas d'abonnement actif");
        if (hotel._count.restaurant >= hotel.subscription.plan.maxRestaurants) {
          throw new LimitExceededError(
            "Le nombre Maximum des Restaurants pour ce plan est déja atteint"
          );
        }
  
        
  
        
        const validRestaurantEmployee = data.restaurantEmployee.filter(
          (ea) => ea.employeeId !== ""
        );
  
        const createdRestaurant = await prisma.restaurant.create({
          data: {
            name: data.name,
            description: data.description,
            hotel: { connect: { id: hotelId } },
           
            restaurantEmployee: {
              create: [
                
                
                ...validRestaurantEmployee.map((ea) => ({
                  employee: { connect: { id: ea.employeeId } },
                })),
              ],
            },
          },
        });
  
        
        return { Restaurant: createdRestaurant };
      });
    } catch (error) {
      throwAppropriateError(error);
    }
  }
  export async function getAllRestaurants(
    hotelId: string
  ): Promise<RestaurantsResult> {
    try {
      const Stoks = await prisma.restaurant.findMany({
        where: { hotelId: hotelId },
        select: { id: true, name: true, description: true , createdAt : true },
      });
  
      return { Restaurants: Stoks };
    } catch (error) {
      throwAppropriateError(error);
    }
  }
  export function checkAdminRole(roles: UserRole[]) {
    if (
      !roles.includes(UserRole.admin) 
    ) {
      throw new UnauthorizedError(
        "Sauf l'Admin peut faire cette action"
      );
    }
  }