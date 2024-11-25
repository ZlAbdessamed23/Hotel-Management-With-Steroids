import { UserRole } from "@prisma/client";

export interface DecodedToken {
  id: string;
  role: UserRole[];
  endDate: string;
  hotelId: string;
  iat: number;
  exp: number;
}
