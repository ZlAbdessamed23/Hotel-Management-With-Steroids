import {
  Admin,
  AdminWithHotelInfo,
  UpdateAdminData,
} from "@/app/api/main/profile/admin/types";
import {
  ForbiddenError,
  NotFoundError,
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import prisma from "@/lib/prisma/prismaClient";
import { Prisma, UserGender, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

export async function getAdminWithHotel(
  userId: string,
  hotelId: string
): Promise<AdminWithHotelInfo> {
  try {
    const admin = await prisma.admin.findFirst({
      where: {
        id: userId,
        hotel: { id: hotelId },
      },
      select: {
        firstName: true,
        lastName: true,
        address: true,
        dateOfBirth: true,
        email: true,
        phoneNumber: true,
        gender: true,
        nationality: true,
        hotel: {
          select: {
            id: true,
            hotelName: true,
            hotelAddress: true,
            country: true,
            hotelPhoneNumber: true,
            hotelEmail: true,
            cardNumber: true,
          },
        },
      },
    });

    if (!admin) {
      throw new NotFoundError("Admin non trouvé");
    }

    return { Admin: admin };
  } catch (error) {
    throwAppropriateError(error);
  }
}
// Function to check if user is an admin
export function checkAdminRole(roles: UserRole[]) {
  if (!roles.includes(UserRole.admin)) {
    throw new ForbiddenError("Sauf Administrateur peut faire cet action");
  }
}
/////////////////// update ///////////////////////
export async function updateProfile(
  employeeId: string,

  data: UpdateAdminData
): Promise<Admin> {
  try {
    let updateData: Prisma.AdminUpdateInput = {};

    // Map UpdateAdminData to AdminUpdateInput
    if (data.firstName) updateData.firstName = data.firstName;
    if (data.lastName) updateData.lastName = data.lastName;
    if (data.address) updateData.address = data.address;
    if (data.dateOfBirth) updateData.dateOfBirth = new Date(data.dateOfBirth);

    if (data.phoneNumber) updateData.phoneNumber = data.phoneNumber;
    if (data.gender) updateData.gender = data.gender as UserGender;
    if (data.nationality) updateData.nationality = data.nationality;

    if (data.isActivated !== undefined)
      updateData.isActivated = data.isActivated;

    // If password is provided, hash it
    if (data.password) {
      updateData.password = await hashPassword(data.password);
    }

    const updatedAdmin = await prisma.admin.update({
      where: {
        id: employeeId,
      },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        address: true,
        dateOfBirth: true,

        phoneNumber: true,
        gender: true,
        nationality: true,
        role: true,
      },
    });

    return { Admin: updatedAdmin };
  } catch (error) {
    throwAppropriateError(error);
  }
}
async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throwAppropriateError(error);
  }
}
