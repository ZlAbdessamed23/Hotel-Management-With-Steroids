import { throwAppropriateError } from "@/lib/error_handler/throwError";
import prisma from "@/lib/prisma/prismaClient";
import {
  DashboardResult,
  DashboardData,
  GenderDistribution,
  ClientSummary,
  CalendarSummary,
} from "@/app/api/main/dashboard/types";
import {
  UserRole,
  UserGender,
  ReservationState,
  RoomStatus,
} from "@prisma/client";
import { UnauthorizedError } from "@/lib/error_handler/customerErrors";

export async function getDashboardData(
  hotelId: string,
  adminId: string,
  subscription: Date
): Promise<DashboardResult> {
  try {
    const [
      admin,
      employeeData,
      roomData,
      clientData,
      sportsFacilityCount,
      calendar,
    ] = await Promise.all([
      prisma.admin.findUnique({
        where: { id: adminId },
        select: { firstName: true, lastName: true },
      }),
      prisma.employee.findMany({
        where: { hotelId },
        select: {
          gender: true,
          role: true,
        },
      }),
      prisma.room.groupBy({
        by: ["status"],
        where: { hotelId },
        _count: { _all: true },
      }),
      prisma.client.findMany({
        where: { hotelId },
        select: {
          id: true,
          gender: true,
          dateOfBirth: true,
          address: true,
          fullName: true,
          identityCardNumber: true,
          phoneNumber: true,
          membersNumber: true,
          reservations: {
            where: { state: ReservationState.valide },
            select: {
              totalPrice: true,
              startDate: true,
              endDate: true,
            },
          },
        },
      }),
      prisma.sportsFacility.count({ where: { hotelId } }),
      prisma.calendar.findMany({
        where: { hotelId },
        select: { title: true, start: true, end: true },
      }),
    ]);

    if (!admin) {
      throw new UnauthorizedError("administrateur non trouvée");
    }

    const processGenderDistribution = (
      data: typeof employeeData | typeof clientData
    ): GenderDistribution => ({
      male: data.filter((e) => e.gender === UserGender.homme).length,
      female: data.filter((e) => e.gender === UserGender.femme).length,
    });

    const employeeGenderDistribution = processGenderDistribution(employeeData);
    const clientGenderDistribution = processGenderDistribution(clientData);

    const employeeCount = employeeData.length;
    const clientCount = clientData.length;
    const coachCount = employeeData.filter((e) =>
      e.role.includes(UserRole.entraineur)
    ).length;
    const roomCount = roomData.reduce(
      (acc, group) => acc + group._count._all,
      0
    );
    const availableRoomCount =
      roomData.find((group) => group.status === RoomStatus.disponible)?._count
        ._all ?? 0;

    const clientSummary: ClientSummary[] = clientData.map((client) => ({
      id: client.id,
      gender: client.gender,
      address: client.address,
      dateOfBirth: client.dateOfBirth,
      fullName: client.fullName,
      phoneNumber: client.phoneNumber,
      identityCardNumber: client.identityCardNumber,
      membersNumber: client.membersNumber || 0,
      reservations: client.reservations.map((res) => ({
        totalPrice: res.totalPrice,
        startDate: res.startDate,
        endDate: res.endDate,
      })),
    }));

    const calendarSummary: CalendarSummary[] = calendar.map((event) => ({
      title: event.title,
      start: event.start,
      end: event.end,
    }));

    const dashboardData: DashboardData = {
      statistics: {
        employeeCount,
        employeeGenderDistribution,
        roomCount,
        availableRoomCount,
        clientCount,
        sportsFacilityCount,
        clientGenderDistribution,
        coachCount,
      },
      clientSummary,
      calendarSummary,
      adminSummary: { firstName: admin.firstName, lastName: admin.lastName },
      subscription: subscription,
    };

    return { data: dashboardData };
  } catch (error) {
    throwAppropriateError(error);
  }
}

export function checkAdminRole(roles: UserRole[]) {
  if (!roles.includes(UserRole.admin)) {
    throw new UnauthorizedError(
      "Seul l'administrateur peut voir le tableau de bord"
    );
  }
}
