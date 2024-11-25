import {
  Client,
  PrismaClient,
  Reservation,
  Prisma,
  Statistics,
  UserGender,
  ClientOrigin,
} from "@prisma/client";

/////////////////////get or create statistics ////////////////////////////
export async function getOrCreateDailyStatistics(
  hotelId: string,
  prisma: Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >
): Promise<Statistics> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let dailyStats = await prisma.statistics.findFirst({
    where: {
      date: today,
      hotelId: hotelId,
    },
  });

  if (!dailyStats) {
    dailyStats = await prisma.statistics.create({
      data: {
        date: today,
        hotelId: hotelId,
        // No need to set default values, they're handled by the model
      },
    });
  }

  return dailyStats;
}
//////////////////////// functions ////////////////////////////////////
/////////////////////////////// employee /////////////////////////////
export async function updateEmployeeStatistics(
  hotelId: string,
  action: "add" | "remove",
  prisma: Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >
): Promise<Statistics> {
  const dailyStats = await getOrCreateDailyStatistics(hotelId, prisma);

  const updatedStats = await prisma.statistics.update({
    where: { id: dailyStats.id },
    data: {
      totalEmployees: action === "add" ? { increment: 1 } : { decrement: 1 },
    },
  });

  return updatedStats;
}
/////////////////////////// room ////////////////////////////////////
export async function updateRoomStatistics(
  hotelId: string,
  action: "add" | "remove",
  prisma: Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >
): Promise<Statistics> {
  const dailyStats = await getOrCreateDailyStatistics(hotelId, prisma);

  const updatedStats = await prisma.statistics.update({
    where: { id: dailyStats.id },
    data: {
      totalRooms: action === "add" ? { increment: 1 } : { decrement: 1 },
    },
  });

  return updatedStats;
}
/////////////////////// event ///////////////////////////////////
export async function updateEventStatistics(
  hotelId: string,
  action: "add" | "remove",
  prisma: Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >
): Promise<Statistics> {
  const dailyStats = await getOrCreateDailyStatistics(hotelId, prisma);

  const updatedStats = await prisma.statistics.update({
    where: { id: dailyStats.id },
    data: {
      totalEvents: action === "add" ? { increment: 1 } : { decrement: 1 },
    },
  });

  return updatedStats;
}
/////////////////////// cafeteria menu /////////////////////////
export async function updateCafeteriaMenuStatistics(
  hotelId: string,
  action: "add" | "remove",
  prisma: Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >
): Promise<Statistics> {
  const dailyStats = await getOrCreateDailyStatistics(hotelId, prisma);

  const updatedStats = await prisma.statistics.update({
    where: { id: dailyStats.id },
    data: {
      totalCafeteriaMenu:
        action === "add" ? { increment: 1 } : { decrement: 1 },
    },
  });

  return updatedStats;
}
//////////////////////// sports facility ///////////////////////////
export async function updateSportsFacilityStatistics(
  hotelId: string,
  action: "add" | "remove",
  prisma: Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >
): Promise<Statistics> {
  const dailyStats = await getOrCreateDailyStatistics(hotelId, prisma);

  const updatedStats = await prisma.statistics.update({
    where: { id: dailyStats.id },
    data: {
      totalSportsFacilities:
        action === "add" ? { increment: 1 } : { decrement: 1 },
    },
  });

  return updatedStats;
}
//////////////////////// stock Items /////////////////////////
export async function updateStockItemsStatistics(
  hotelId: string,
  action: "add" | "remove",
  prisma: Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >
): Promise<Statistics> {
  const dailyStats = await getOrCreateDailyStatistics(hotelId, prisma);

  const updatedStats = await prisma.statistics.update({
    where: { id: dailyStats.id },
    data: {
      totalStockItems: action === "add" ? { increment: 1 } : { decrement: 1 },
    },
  });

  return updatedStats;
}
///////////////// transaction /////////////////////////
export async function updateStockTransactionsStatistics(
  hotelId: string,
  transactionAmount: number,
  prisma: Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >
): Promise<Statistics> {
  const dailyStats = await getOrCreateDailyStatistics(hotelId, prisma);

  const updatedStats = await prisma.statistics.update({
    where: { id: dailyStats.id },
    data: {
      totalTransactions: { increment: 1 },
      totalTransactionAmount: { increment: transactionAmount },
    },
  });

  return updatedStats;
}
///////////////////////////// note /////////////////////////////
export async function updateNoteStatistics(
  hotelId: string,
  action: "add" | "remove",
  prisma: Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >
): Promise<Statistics> {
  const dailyStats = await getOrCreateDailyStatistics(hotelId, prisma);

  const updatedStats = await prisma.statistics.update({
    where: { id: dailyStats.id },
    data: {
      totalNote: action === "add" ? { increment: 1 } : { decrement: 1 },
    },
  });

  return updatedStats;
}
//////////////////////// task //////////////////////////
export async function updateTaskStatistics(
  hotelId: string,
  action: "add" | "remove",
  prisma: Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >
): Promise<Statistics> {
  const dailyStats = await getOrCreateDailyStatistics(hotelId, prisma);

  const updatedStats = await prisma.statistics.update({
    where: { id: dailyStats.id },
    data: {
      totalTask: action === "add" ? { increment: 1 } : { decrement: 1 },
    },
  });

  return updatedStats;
}
////////////////////// report ///////////////////////////
export async function updateReportStatistics(
  hotelId: string,
  action: "add" | "remove",
  prisma: Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >
): Promise<Statistics> {
  const dailyStats = await getOrCreateDailyStatistics(hotelId, prisma);

  const updatedStats = await prisma.statistics.update({
    where: { id: dailyStats.id },
    data: {
      totalReport: action === "add" ? { increment: 1 } : { decrement: 1 },
    },
  });

  return updatedStats;
}
////////////////// client ////////////////////////////

type StatisticsUpdateData = Prisma.StatisticsUpdateInput;

export async function updateClientCheckInStatistics(
  hotelId: string,
  oldGender: UserGender | null,
  newGender: UserGender,
  dateOfBirth: Date | null,
  oldIsLocal: ClientOrigin | null,
  newIsLocal: ClientOrigin,
  totalPrice: number,
  prisma: Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >,
  isNewClient: boolean = false
): Promise<any> {
  const dailyStats = await getOrCreateDailyStatistics(hotelId, prisma);
  const updateData: StatisticsUpdateData = {
    ClientPrice: { increment: totalPrice },
  };

  // Only store age for new clients
  if (isNewClient && dateOfBirth) {
    const clientAge = calculateAge(dateOfBirth);
    updateData.ClientAge = { push: clientAge };
  }

  // If it's a new client, increment the basic counts
  if (isNewClient) {
    updateData.totalClients = { increment: 1 };
    updateData.newClients = { increment: 1 };
    updateData.checkIns = { increment: 1 };

    // For new clients, simply increment based on their initial values
    if (newGender === UserGender.homme) {
      updateData.maleClients = { increment: 1 };
    }
    if (newIsLocal === ClientOrigin.local) {
      updateData.LocalClient = { increment: 1 };
    }
  } else {
    // For existing clients, handle transitions
    if (oldGender !== newGender) {
      if (oldGender === UserGender.homme) {
        updateData.maleClients = { decrement: 1 };
      }
      if (newGender === UserGender.homme) {
        updateData.maleClients = { increment: 1 };
      }
    }

    if (oldIsLocal !== newIsLocal) {
      if (oldIsLocal === ClientOrigin.local) {
        updateData.LocalClient = { decrement: 1 };
      }
      if (newIsLocal === ClientOrigin.local) {
        updateData.LocalClient = { increment: 1 };
      }
    }
  }

  const updatedStats = await prisma.statistics.update({
    where: { id: dailyStats.id },
    data: updateData,
  });

  return updatedStats;
}

function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const m = today.getMonth() - dateOfBirth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }
  return age;
}
///////////////////// client changes ///////////////////////////
