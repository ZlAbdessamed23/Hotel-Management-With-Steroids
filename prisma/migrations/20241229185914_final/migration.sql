-- CreateEnum
CREATE TYPE "UserGender" AS ENUM ('homme', 'femme');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'receptionist', 'chef', 'nettoyeur', 'restaurent_Manager', 'reception_Manager', 'stock_Manager', 'entraineur', 'gouvernante', 'valet_de_chambre');

-- CreateEnum
CREATE TYPE "DaysOfWeek" AS ENUM ('Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi');

-- CreateEnum
CREATE TYPE "EmployeeState" AS ENUM ('en_travaille', 'absent', 'en_vacance');

-- CreateEnum
CREATE TYPE "Departements" AS ENUM ('restauration', 'reception');

-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('individuelle', 'double', 'triple', 'familiale', 'communiquante', 'suite');

-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('disponible', 'reservee', 'en_attente', 'hors_service', 'en_panne');

-- CreateEnum
CREATE TYPE "ClientOrigin" AS ENUM ('etranger', 'local');

-- CreateEnum
CREATE TYPE "ReservationState" AS ENUM ('en_attente', 'valide', 'libere', 'annule', 'absent');

-- CreateEnum
CREATE TYPE "ReservationSource" AS ENUM ('seul', 'agence_de_voyage', 'evenement');

-- CreateEnum
CREATE TYPE "DiscoveryChannel" AS ENUM ('facebook', 'instagram', 'site_web', 'google', 'plateforme_de_reservation', 'television', 'email', 'autre');

-- CreateEnum
CREATE TYPE "CafeteriaRestaurentItemCategory" AS ENUM ('caffee', 'lait', 'jus', 'plat', 'sandwich', 'fruit', 'gateau');

-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('petit_déjeuner', 'dîner');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('en_cours', 'terminé');

-- CreateEnum
CREATE TYPE "TransactionOperationType" AS ENUM ('acheter', 'transferer');

-- CreateEnum
CREATE TYPE "SportsFacilityType" AS ENUM ('football', 'basketball', 'handball', 'volleyball', 'tennis', 'golf', 'musculation', 'fitness', 'gymnastique', 'autre');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('anniversaire', 'fetes', 'evenement', 'reunion', 'evenement_social');

-- CreateEnum
CREATE TYPE "AttendueType" AS ENUM ('normale', 'organizatrice', 'serveur');

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "availableChat" BOOLEAN NOT NULL,
    "availableReportManagement" BOOLEAN NOT NULL,
    "availableEventManagement" BOOLEAN NOT NULL,
    "availableCafeteriaManagement" BOOLEAN NOT NULL,
    "availableStockManagement" BOOLEAN NOT NULL,
    "availableSportManagement" BOOLEAN NOT NULL,
    "maxEmployees" INTEGER NOT NULL,
    "maxClients" INTEGER NOT NULL,
    "maxRooms" INTEGER NOT NULL,
    "maxReports" INTEGER NOT NULL,
    "maxEvents" INTEGER NOT NULL,
    "maxSales" INTEGER NOT NULL,
    "maxCafeteriaMenu" INTEGER NOT NULL,
    "maxRestaurantMenu" INTEGER NOT NULL,
    "maxNotes" INTEGER NOT NULL,
    "maxTasks" INTEGER NOT NULL,
    "maxStockCategory" INTEGER NOT NULL,
    "maxStockItem" INTEGER NOT NULL,
    "maxStockTransactions" INTEGER NOT NULL,
    "maxHouseKeepingPlanifications" INTEGER NOT NULL,
    "maxRestaurants" INTEGER NOT NULL,
    "maxCafeterias" INTEGER NOT NULL,
    "maxStocks" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "gender" "UserGender" NOT NULL,
    "nationality" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole"[] DEFAULT ARRAY['admin']::"UserRole"[],
    "isActivated" BOOLEAN NOT NULL DEFAULT false,
    "resetCode" TEXT,
    "resetCodeExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hotel" (
    "id" TEXT NOT NULL,
    "hotelName" TEXT NOT NULL,
    "hotelAddress" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "hotelPhoneNumber" TEXT NOT NULL,
    "hotelEmail" TEXT NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hotel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hotelId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailVerificationToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "adminId" TEXT,
    "employeeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailVerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "gender" "UserGender" NOT NULL,
    "nationality" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole"[],
    "departement" "Departements"[],
    "workingDays" "DaysOfWeek"[],
    "state" "EmployeeState",
    "hotelId" TEXT NOT NULL,
    "isActivated" BOOLEAN NOT NULL DEFAULT false,
    "resetCode" TEXT,
    "resetCodeExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "type" "RoomType" NOT NULL,
    "number" TEXT NOT NULL,
    "floorNumber" TEXT,
    "description" TEXT,
    "price" DECIMAL(65,30) NOT NULL,
    "capacity" INTEGER NOT NULL,
    "status" "RoomStatus" NOT NULL DEFAULT 'disponible',
    "outOfServiceDescription" TEXT,
    "hotelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT,
    "identityCardNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "gender" "UserGender" NOT NULL,
    "membersNumber" INTEGER,
    "kidsNumber" INTEGER,
    "clientOrigin" "ClientOrigin" NOT NULL DEFAULT 'local',
    "employeeId" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
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

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "phoneNumber" TEXT,
    "email" TEXT,
    "identityCardNumber" TEXT,
    "address" TEXT NOT NULL,
    "nationality" TEXT,
    "gender" "UserGender" NOT NULL,
    "hotelId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "deadline" TIMESTAMP(3) NOT NULL,
    "hotelId" TEXT NOT NULL,
    "adminId" TEXT,
    "employeeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SportsFacility" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "capacity" INTEGER NOT NULL,
    "price" DECIMAL(65,30),
    "openingDays" "DaysOfWeek"[],
    "location" TEXT,
    "type" "SportsFacilityType" NOT NULL,
    "hotelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SportsFacility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SportsFacilityCoach" (
    "id" TEXT NOT NULL,
    "sportFacilityId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,

    CONSTRAINT "SportsFacilityCoach_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SportsFacilityMember" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT,
    "identityCardNumber" TEXT,
    "clientName" TEXT NOT NULL,
    "gender" "UserGender" NOT NULL,
    "clientId" TEXT NOT NULL,
    "sportsFacilityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SportsFacilityMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cafeteria" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "hotelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cafeteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CafeteriaEmployee" (
    "id" TEXT NOT NULL,
    "cafeteriaId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CafeteriaEmployee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CafeteriaMenu" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "cafeteriaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CafeteriaMenu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CafeteriaMenuItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "CafeteriaRestaurentItemCategory" NOT NULL,
    "cafeteriaMenuId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CafeteriaMenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Restaurant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "hotelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantEmployee" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestaurantEmployee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantMenu" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "lunchStartTime" TEXT NOT NULL,
    "lunchEndTime" TEXT NOT NULL,
    "dinnerStartTime" TEXT NOT NULL,
    "dinnerEndTime" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestaurantMenu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantMenuItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "mealType" "MealType" NOT NULL,
    "category" "CafeteriaRestaurentItemCategory" NOT NULL,
    "restaurantMenuId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestaurantMenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "creator" TEXT NOT NULL,
    "createdByEmployeeId" TEXT,
    "createdByAdminId" TEXT,
    "hotelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentAccess" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "employeeId" TEXT,
    "adminId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "deadline" TIMESTAMP(3) NOT NULL,
    "isDone" BOOLEAN NOT NULL DEFAULT false,
    "createdByEmployeeId" TEXT,
    "createdByAdminId" TEXT,
    "hotelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeTask" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stock" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "hotelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockEmployee" (
    "id" TEXT NOT NULL,
    "stockId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockEmployee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "hotelId" TEXT NOT NULL,
    "stockId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "description" TEXT,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "sku" TEXT,
    "unit" TEXT,
    "minimumQuantity" INTEGER NOT NULL,
    "isNeeded" BOOLEAN NOT NULL DEFAULT false,
    "supplierName" TEXT,
    "supplierPhone" TEXT,
    "supplierAddress" TEXT,
    "supplierEmail" TEXT,
    "categoryId" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "stockId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "type" "TransactionOperationType" NOT NULL,
    "transactionAmount" DOUBLE PRECISION NOT NULL,
    "itemId" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "stockId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "leader" TEXT,
    "guests" INTEGER,
    "description" TEXT,
    "bankCard" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "eventType" "EventType",
    "hotelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendue" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT,
    "identityCardNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "gender" "UserGender" NOT NULL,
    "type" "AttendueType" NOT NULL,
    "reservationSource" "ReservationSource" NOT NULL DEFAULT 'evenement',
    "hotelId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "reservationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventSeance" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventSeance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Calendar" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Calendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Statistics" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "totalEmployees" INTEGER NOT NULL DEFAULT 0,
    "totalRooms" INTEGER NOT NULL DEFAULT 0,
    "totalEvents" INTEGER NOT NULL DEFAULT 0,
    "totalMenuItems" INTEGER NOT NULL DEFAULT 0,
    "totalSportsFacilities" INTEGER NOT NULL DEFAULT 0,
    "totalStockItems" INTEGER NOT NULL DEFAULT 0,
    "totalTransactions" INTEGER NOT NULL DEFAULT 0,
    "totalTransactionAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalCafeteriaMenu" INTEGER NOT NULL DEFAULT 0,
    "totalNote" INTEGER NOT NULL DEFAULT 0,
    "totalTask" INTEGER NOT NULL DEFAULT 0,
    "totalReport" INTEGER NOT NULL DEFAULT 0,
    "totalClients" INTEGER NOT NULL DEFAULT 0,
    "newClients" INTEGER NOT NULL DEFAULT 0,
    "checkIns" INTEGER NOT NULL DEFAULT 0,
    "checkOuts" INTEGER NOT NULL DEFAULT 0,
    "ClientPrice" INTEGER NOT NULL DEFAULT 0,
    "ClientAge" INTEGER[],
    "LocalClient" INTEGER NOT NULL DEFAULT 0,
    "maleClients" INTEGER NOT NULL DEFAULT 0,
    "hotelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Budget" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "stockId" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientsHistorique" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "identityCardNumber" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "gender" "UserGender" NOT NULL,
    "starDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "hotelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientsHistorique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HouseKeepingPlanification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HouseKeepingPlanification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LostObject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LostObject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Plan_name_key" ON "Plan"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Hotel_adminId_key" ON "Hotel"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_hotelId_key" ON "Subscription"("hotelId");

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerificationToken_token_key" ON "EmailVerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_roomId_key" ON "Reservation"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "SportsFacilityCoach_sportFacilityId_employeeId_key" ON "SportsFacilityCoach"("sportFacilityId", "employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "CafeteriaEmployee_cafeteriaId_employeeId_key" ON "CafeteriaEmployee"("cafeteriaId", "employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantEmployee_restaurantId_employeeId_key" ON "RestaurantEmployee"("restaurantId", "employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentAccess_documentId_employeeId_adminId_key" ON "DocumentAccess"("documentId", "employeeId", "adminId");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeTask_employeeId_taskId_key" ON "EmployeeTask"("employeeId", "taskId");

-- CreateIndex
CREATE UNIQUE INDEX "StockEmployee_stockId_employeeId_key" ON "StockEmployee"("stockId", "employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "Budget_stockId_key" ON "Budget"("stockId");

-- AddForeignKey
ALTER TABLE "Hotel" ADD CONSTRAINT "Hotel_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailVerificationToken" ADD CONSTRAINT "EmailVerificationToken_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailVerificationToken" ADD CONSTRAINT "EmailVerificationToken_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingReservation" ADD CONSTRAINT "PendingReservation_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingReservation" ADD CONSTRAINT "PendingReservation_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingReservation" ADD CONSTRAINT "PendingReservation_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingReservation" ADD CONSTRAINT "PendingReservation_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SportsFacility" ADD CONSTRAINT "SportsFacility_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SportsFacilityCoach" ADD CONSTRAINT "SportsFacilityCoach_sportFacilityId_fkey" FOREIGN KEY ("sportFacilityId") REFERENCES "SportsFacility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SportsFacilityCoach" ADD CONSTRAINT "SportsFacilityCoach_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SportsFacilityMember" ADD CONSTRAINT "SportsFacilityMember_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SportsFacilityMember" ADD CONSTRAINT "SportsFacilityMember_sportsFacilityId_fkey" FOREIGN KEY ("sportsFacilityId") REFERENCES "SportsFacility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cafeteria" ADD CONSTRAINT "Cafeteria_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CafeteriaEmployee" ADD CONSTRAINT "CafeteriaEmployee_cafeteriaId_fkey" FOREIGN KEY ("cafeteriaId") REFERENCES "Cafeteria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CafeteriaEmployee" ADD CONSTRAINT "CafeteriaEmployee_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CafeteriaMenu" ADD CONSTRAINT "CafeteriaMenu_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CafeteriaMenu" ADD CONSTRAINT "CafeteriaMenu_cafeteriaId_fkey" FOREIGN KEY ("cafeteriaId") REFERENCES "Cafeteria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CafeteriaMenuItem" ADD CONSTRAINT "CafeteriaMenuItem_cafeteriaMenuId_fkey" FOREIGN KEY ("cafeteriaMenuId") REFERENCES "CafeteriaMenu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantEmployee" ADD CONSTRAINT "RestaurantEmployee_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantEmployee" ADD CONSTRAINT "RestaurantEmployee_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantMenu" ADD CONSTRAINT "RestaurantMenu_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantMenu" ADD CONSTRAINT "RestaurantMenu_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantMenuItem" ADD CONSTRAINT "RestaurantMenuItem_restaurantMenuId_fkey" FOREIGN KEY ("restaurantMenuId") REFERENCES "RestaurantMenu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_createdByEmployeeId_fkey" FOREIGN KEY ("createdByEmployeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_createdByAdminId_fkey" FOREIGN KEY ("createdByAdminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentAccess" ADD CONSTRAINT "DocumentAccess_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentAccess" ADD CONSTRAINT "DocumentAccess_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentAccess" ADD CONSTRAINT "DocumentAccess_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_createdByEmployeeId_fkey" FOREIGN KEY ("createdByEmployeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_createdByAdminId_fkey" FOREIGN KEY ("createdByAdminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeTask" ADD CONSTRAINT "EmployeeTask_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeTask" ADD CONSTRAINT "EmployeeTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockEmployee" ADD CONSTRAINT "StockEmployee_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockEmployee" ADD CONSTRAINT "StockEmployee_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendue" ADD CONSTRAINT "Attendue_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendue" ADD CONSTRAINT "Attendue_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendue" ADD CONSTRAINT "Attendue_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSeance" ADD CONSTRAINT "EventSeance_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calendar" ADD CONSTRAINT "Calendar_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Statistics" ADD CONSTRAINT "Statistics_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientsHistorique" ADD CONSTRAINT "ClientsHistorique_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HouseKeepingPlanification" ADD CONSTRAINT "HouseKeepingPlanification_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LostObject" ADD CONSTRAINT "LostObject_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
