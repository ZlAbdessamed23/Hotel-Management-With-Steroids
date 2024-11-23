-- CreateTable
CREATE TABLE "PendingReservation" (
    "id" TEXT NOT NULL,
    "roomNumber" TEXT NOT NULL,
    "roomType" "RoomType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "totalDays" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "state" "ReservationState" NOT NULL DEFAULT 'en_attente',
    "source" "ReservationSource" DEFAULT 'seul',
    "currentOccupancy" INTEGER NOT NULL DEFAULT 1,
    "discoveryChannel" "DiscoveryChannel",
    "hotelId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "clientId" TEXT,
    "roomId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PendingReservation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PendingReservation" ADD CONSTRAINT "PendingReservation_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingReservation" ADD CONSTRAINT "PendingReservation_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingReservation" ADD CONSTRAINT "PendingReservation_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingReservation" ADD CONSTRAINT "PendingReservation_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
