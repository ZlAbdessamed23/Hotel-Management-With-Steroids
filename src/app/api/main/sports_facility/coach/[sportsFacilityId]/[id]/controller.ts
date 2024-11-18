import { NotFoundError, UnauthorizedError } from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import prisma from "@/lib/prisma/prismaClient";
import { SportFacilityCoach } from "@/app/api/main/sports_facility/coach/[sportsFacilityId]/[id]/types";
import { UserRole } from "@prisma/client";
export async function getSportFacilityCoach(
  coachId: string,
  sportFacilityId: string,
  hotelId: string,
  
): Promise<SportFacilityCoach> {
  try {
    const sportFacility = await prisma.sportsFacility.findUnique({
      where: {
        id: sportFacilityId,
        hotelId: hotelId,
      },
      include: {
        sportFacilityCoaches: {
          where: {
            employeeId: coachId,
            employee: {
              role: {
                has: "entraineur",
              },
            },
          },
          include: {
            employee: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phoneNumber: true,
                gender: true,
                workingDays: true,
                state: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!sportFacility) {
      throw new NotFoundError("Salle de sport non trouvée");
    }

    if (sportFacility.sportFacilityCoaches.length === 0) {
      throw new NotFoundError(
        "Entraineur non trouvée , ou vous n'avez pas d'entraineur droits"
      );
    }

    const coach = sportFacility.sportFacilityCoaches[0];

    return { coach };
  } catch (error) {
    throwAppropriateError(error);
  }
}
export function checkReceptionManagerCoachAdminRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.reception_Manager) &&
    !roles.includes(UserRole.entraineur) &&
    !roles.includes(UserRole.admin)
  ) {
    throw new UnauthorizedError(
      "Sauf le reception manager ,l'entraineur et l'administrateur peut faire cette action"
    );
  }
}