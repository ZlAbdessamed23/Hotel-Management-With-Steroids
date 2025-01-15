import prisma from "@/lib/prisma/prismaClient";
import {
  AddEmployeeData,
  Employee,
  Employees,
} from "@/app/api/main/employee/types";
import bcrypt from "bcrypt";

import {
  ConflictError,
  SubscriptionError,
  UnauthorizedError,
  ValidationError,
} from "@/lib/error_handler/customerErrors";

import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { LimitExceededError } from "@/lib/error_handler/customerErrors";
import { UserRole } from "@prisma/client";
import { updateEmployeeStatistics } from "@/app/api/main/statistics/statistics";
import { sendMail } from "@/lib/third_party/email/sendMail";
import { generateVerificationToken } from "@/lib/third_party/email/generateVerificationToken";

/////////////////////////// Add employee //////////////////////////////////
export async function addEmployee(
  data: AddEmployeeData,
  hotelId: string
): Promise<Employee> {
  try {
    // Input validation
    if (!data.email || !data.password) {
      throw new ValidationError("Email and password are required");
    }

    return await prisma.$transaction(async (prisma) => {
      // Parallel fetch of hotel data, employee count, and existing employee check
      const [hotel, employeeCount, existingEmployee] = await Promise.all([
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
        prisma.employee.count({
          where: { hotelId },
        }),
        prisma.employee.findUnique({
          where: { email: data.email },
        }),
      ]);

      // Validation checks
      if (!hotel) throw new ValidationError("Hotel non trouvé");
      if (!hotel.subscription?.plan)
        throw new SubscriptionError("Hotel n'a pas d'abonnement actif");
      if (employeeCount >= hotel.subscription.plan.maxEmployees) {
        throw new LimitExceededError(
          "Le nombre Maximum des employées pour ce plan est déja atteint"
        );
      }
      if (existingEmployee) {
        throw new ConflictError("Un employée avec ce email existe déja");
      }

      // Hash password
      const hashedPassword = await hashPassword(data.password);

      // Create employee
      const newEmployee = await prisma.employee.create({
        data: {
          ...data,
          password: hashedPassword,
          hotelId,
        },
      });

      // Generate token and perform post-creation tasks in parallel
      const token = generateVerificationToken(newEmployee.id);
      
      await Promise.all([
        prisma.emailVerificationToken.create({
          data: {
            token,
            employeeId: newEmployee.id,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          },
        }),
        sendVerificationEmail(newEmployee.email, token,newEmployee.firstName),
        updateEmployeeStatistics(hotelId, "add", prisma)
      ]);

      return { Employee: newEmployee };  // lowercase to match return type
    });
  } catch (error) {
    throwAppropriateError(error);
    throw error;  // Ensure error is propagated
  }
}

  



async function sendVerificationEmail(
  email: string,
  token: string ,
  firstName: string
): Promise<void> {
  const verificationLink = `${process.env.BASE_URL}/${token}`;
  await sendMail(
    email,
    "Verify Your Email",
    `Please verify your email by clicking on this link: ${verificationLink}`,
    `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link
            href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
            rel="stylesheet">
        <title>Email Verification</title>
    </head>
    
    <body style="font-family: Roboto;max-width: 600px; margin: auto; padding-top: 10px;">
        <div
            style="border: 2px solid rgb(212, 212, 212); border-radius: 15px; box-shadow: 2px 2px 8px rgba(170, 170, 170, 0.5);">
            <div style="text-align: center; padding-top: 16px">
                <a href="http://104.154.75.47/"><img src="https://i.postimg.cc/FFSgdbv6/hotyverse.png" alt="hotyverse-logo-image" style="size: 3rem;"></a>
                <h2 style="font-size: medium; font-weight: 500; letter-spacing: 5px;">Hoty Verse</h2>
                <h1 style="font-size: x-large; font-weight: 700; letter-spacing: 1.2px;">Activer Votre Compte</h1>
            </div>
            <div style="height: 1px; width: 100%; background-color: #E8E6F6;"></div>
            <div style="padding-top: 10px;padding-right: 10px;padding-left: 40px;padding-bottom: 16px;">
                <p style="font-size: medium;font-weight: 500;">Hey ${firstName},</p>
                <p style="font-size: medium; font-weight: 400;">Activer votre compte par cet email. Cliquez simplement sur
                    le bouton ci-dessous et tout sera prêt. Si
                    vous
                    n'avez pas créé ce compte, veuillez ignorer cet e-mail.</p>
    
            </div>
            <div style="text-align: center; padding-bottom: 46px;">
                <a href="${verificationLink}"
                    style="display: inline-block; width: 75%; height: 60px; border-radius: 8px; background-color: #3177FF; border: none; color: white; font-weight: 400; font-size: medium; text-align: center; line-height: 60px; text-decoration: none; transition: background-color 0.3s;">
                    Activer le Compte
                </a>
            </div>
        </div>
        <div style="text-align: center;">
            <p style="width: 50%;margin: auto;font-size: medium;font-weight: 300;">
                problèmes ou questions? contactez-nous à <span style="color: #001E3C;">hotyversedz@gmail.com</span>
            </p>
            <div>
                <a href="http://104.154.75.47/"><img src="https://i.postimg.cc/FFSgdbv6/hotyverse.png" alt="hotyverse-logo-image" style="size: 3rem;"></a>
                <p style="font-size: small; font-weight: 300; color: #001E3C;">2024 cloudy verse</p>
                <p style="font-size: small; font-weight: 300; color: #001E3C;">Tous les droits sont réservés</p>
            </div>
        </div>
    </body>
    
    </html>
    `
  );
}
//////////////////////// Get all employee ////////////////////////////////
export async function getAllEmployees(hotelId: string): Promise<Employees> {
  try {
    // Fetch all employees excluding sensitive fields
    const employees = await prisma.employee.findMany({
      where: { hotelId: hotelId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        address: true,
        dateOfBirth: true,
        email: true,
        phoneNumber: true,
        gender: true,
        nationality: true,
        role: true,
        departement: true,
        workingDays: true,
        state: true,
      },
    });

    return { Employees: employees };
  } catch (error) {
    throwAppropriateError(error);
  }
}

export function checkAdminRole(roles: UserRole[]) {
  if (!roles.includes(UserRole.admin)) {
    throw new UnauthorizedError(
      "Sauf l'Administrateur peut faire cette action"
    );
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
////////////////////// Statistics ///////////////////////////
