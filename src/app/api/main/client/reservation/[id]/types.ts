import { Prisma } from "@prisma/client";

export type ReservationResult = {
  reservation: Prisma.ReservationGetPayload<{}>;
};
