import { UserGender } from "@prisma/client";

export type GenderDistribution = {
  male: number;
  female: number;
};

export type ReservationSummary = {
  totalPrice:number;
  startDate: Date;
  endDate: Date;
};

export type CalendarSummary = {
  title: string;
  start: string;
  end: string;
};

export type ClientSummary = {
  id: string;
  gender: UserGender;
  reservations: ReservationSummary[];
  dateOfBirth: Date,
  address: string,
  fullName: string,
  identityCardNumber: string,
  phoneNumber: string,
  membersNumber: number,
};
export type AdminSummary = {
  firstName: string;
  lastName: string;
};

export type DashboardStatistics = {
  employeeCount: number;
  employeeGenderDistribution: GenderDistribution;
  roomCount: number;
  availableRoomCount: number;
  clientCount: number;
  sportsFacilityCount: number;
  clientGenderDistribution: GenderDistribution;
  coachCount: number;
};

export type DashboardData = {
  statistics: DashboardStatistics;
  clientSummary: ClientSummary[];
  calendarSummary: CalendarSummary[];
  adminSummary: AdminSummary;
  subscription: Date;
};

export type DashboardResult = {
  data: DashboardData;
};
