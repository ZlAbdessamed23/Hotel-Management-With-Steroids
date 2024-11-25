import { Prisma } from "@prisma/client";

export type EmailVerificationResult =
  | {
      status: "success";
      user: Prisma.AdminGetPayload<{}> | Prisma.EmployeeGetPayload<{}>;
    }
  | { status: "invalid" }
  | { status: "expired" };
