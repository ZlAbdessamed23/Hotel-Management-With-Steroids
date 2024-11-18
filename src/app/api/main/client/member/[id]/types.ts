import { Prisma, UserGender } from "@prisma/client";

export type UpdateMemberData = {
  fullName?: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  email?: string;
  identityCardNumber?: string;
  address?: string;
  nationality?: string;
  gender?: UserGender;
};
export type MemberResult = {
  member: Prisma.MemberGetPayload<{}>;
};
