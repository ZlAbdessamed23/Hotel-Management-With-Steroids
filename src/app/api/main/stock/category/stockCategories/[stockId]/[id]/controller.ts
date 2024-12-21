import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { Prisma, PrismaClient, UserRole } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient";
import { CategoryResult, UpdateStockCategoryData } from "./types";

export async function getStockCategoryById(
  stockId: string,
  stockCategoryId: string,
  hotelId: string,
  userId: string,
  userRole: UserRole[]
): Promise<CategoryResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      
      const existingCategory = await prisma.category.findUnique({
        where: { id: stockCategoryId, hotelId: hotelId, stockId },select : {
          id : true,
          description : true,
          createdAt  : true,
          stockId : true,
          name : true,
          
        }
      });

      if (!existingCategory ) {
        throw new NotFoundError(`Category non trouvée`);
      }

      return { Category: existingCategory };
    })

  } catch (error) {
    throw throwAppropriateError(error);
  }
}

export async function deleteStockCategory(
  stockId: string,
  stockCategoryId: string,
  hotelId: string,
 
): Promise<CategoryResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      
      const deletedMenu = await prisma.category.delete({
        where: { id: stockCategoryId, hotelId: hotelId, stockId },
        select : {
          id : true,
          description : true,
          createdAt  : true,
          stockId : true,
          name : true,
          
        }
      });

      return { Category: deletedMenu };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

export async function updateStockCategory(
  stockCategoryId: string,
  stockId: string,
  hotelId: string,
  
  data: UpdateStockCategoryData
): Promise<CategoryResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      
      const updateData: Prisma.CategoryUpdateInput = {
        name: data.name,
        description: data.description,

      };

      Object.keys(updateData).forEach((key) => {
        if (
          key in updateData &&
          updateData[key as keyof Prisma.CategoryUpdateInput] === undefined
        ) {
          delete updateData[key as keyof Prisma.CategoryUpdateInput];
        }
      });

      const updatedCategory = await prisma.category.update({
        where: { id: stockCategoryId, hotelId, stockId },
        data: updateData,
        select : {
          id : true,
          description : true,
          createdAt  : true,
          stockId : true,
          name : true,
          
        }
      });

      return { Category: updatedCategory };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}


