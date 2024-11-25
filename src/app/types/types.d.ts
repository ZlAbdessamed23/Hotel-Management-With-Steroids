//user types

import { Sassy_Frass } from "next/font/google";
import { StaticImageData } from "next/image";
import { IconType } from "react-icons";
import { ClientState, DaysOfWeek, Departements, EmployeeState, OperationMode, ReservationSource, RoomState, RoomType, SportHalls, UserGender, UserPermission, UserRole, Restau_CafeteriaItemCategories, StockTransactionType, BankCardTypes, DiscoveredWay, ReservationState, EventType, EventGuestsType, ClientOrigin, Units } from "./constants";
import React from "react";


interface ForgotPassword {
    email: string;
    collection: "admin" | "employee";
};

interface VerificationCode extends ForgotPassword {
    resetCode: string;
};

interface LoggedUser {
    email: string;
    password: string;
    permission: UserPermission,
};

interface RegisteredAdmin {
    id?: string;
    firstName: string;
    lastName: string;
    address: string;
    dateOfBirth: Date | string;
    email: string;
    phoneNumber: string;
    gender: UserGender;
    nationality: string;
    password: string;
};

interface Hotel {
    id: string;
    hotelName: string;
    hotelAddress: string;
    hotelEmail: string;
    hotelPhoneNumber: string;
    country: string;
    cardNumber: string;
};

type HotelInfos = Omit<Hotel, 'id' | 'cardNumber'>;

interface RegistrationInfos extends Hotel, RegisteredAdmin { };
interface LoginInfos extends Hotel, LoggedUser { };

interface EmployeeProfileType {
    address: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    email: string;
    phoneNumber: string;
    gender: UserGender;
    nationality: string;
    id: string;
    departement: string | Departements[],
    role: string | UserRole[],
    state: EmployeeState,
    employeeTask:
    {
        task: {
            id: string;
            title: string;
            description: string;
            deadline: Date | string;
            isDone: boolean
        }
    }[];
    note: {
        title: string;
        description: string;
        deadline: Date | string;
        isDone: boolean;
    }[];
};

interface RegisteredEmployee extends RegisteredAdmin {
    departement: Departements[] | string;
    role: UserRole[] | string;
    workingDays?: | Array<DaysOfWeek> | string;
    state: EmployeeState;
};

interface Coach extends RegisteredAdmin {
    speciality: string;
    workTime: string;
};

interface EventInvited {
    id?: string;
    fullName: string;
    gender: UserGender;
    dateOfBirth: Date | string;
    phoneNumber: string;
    email?: string;
    identityCardNumber: string;
    address: string;
    eventId: string;
    state: ClientState;
    nationality: string;
    reservations?: Array<{ id: string }>;
    type: EventGuestsType;
    reservationSource: ReservationSource.event,
};

interface EventOrganiser extends EventInvited {
    role: string;
};

interface User {
    firstName: string;
    lastName: string;
    email: string;
    id: string;
    role: string;
};

interface Client {
    id?: string;
    eventId?: string;
    reservations?: Array<{ id: string, startDate: string | Date, endDate: string | Date }>;
    fullName: string;
    dateOfBirth: Date | string;
    phoneNumber: string;
    email?: string;
    identityCardNumber: string;
    address: string;
    nationality: string;
    membersNumber: number;
    kidsNumber: number;
    gender: UserGender | string;
    clientOrigin: ClientOrigin;
};

interface Reservation {
    id?: string;
    roomNumber: string;
    roomType: RoomType;
    startDate: Date | string;
    endDate: Date | string;
    totalDays: number;
    totalPrice: number;
    state: ReservationState;
    source?: ReservationSource;
    clientId: string;
    discoverChannel?: DiscoveredWay;
    reservationSource?: ReservationSource;
}

interface Event {
    id?: string;
    name: string;
    leader: string;
    isGuestNumberKnown: "oui" | "non";
    guests?: number;
    startDate: Date | string;
    endDate: Date | string;
    bankCard: string;
    eventType: EventType,
    description: string;
    createdAt?: Date | string;
};

interface EventStage {
    id?: string;
    title: string;
    description: string;
    start: Date | string;
    end: Date | string;
    eventId?: string;
};

interface Note {
    id?: string;
    title: string;
    description: string;
    deadline: Date | string;
    isDone: boolean;
};

interface Task {
    id?: string;
    title: string;
    description: string;
    deadline: Date | string;
    isDone: boolean;
    receivers: Array<string> | string;
    assignedEmployees?: {
        employee: {
            firstName: string;
            lastName: string;
            id: string;
            role: string | UserRole;
        };
    }[]
};

interface Room {
    id?: string;
    status: RoomState;
    type: RoomType;
    floorNumber: string;
    description: string;
    number: string;
    price: string;
    outOfServiceDescription?: string;
};

interface ReservedRoom extends Room {
    reservation: {
        id: string;
        startDate: Date | string;
        endDate: Date | string;
        client: {
            clientId: string;
            fullName: string;
        };
    };
    reservationSource: ReservationSource;
};

interface SportHall {
    name: string;
    type: SportHalls;
    description: string;
    location?: string;
    coaches?: Array<string> | string;
    sportsFacilityCoaches?: {
        employeeId: string;
    }[];
    openingDays?: Array<DaysOfWeek> | string;
    id: string;
    createdAt: Date | string;
    price?: number;
    capacity: number;
};

interface SportHallClient {
    id?: string;
    email?: string;
    identityCardNumber: string;
    phoneNumber?: string;
    name?: string;
    gender?: UserGender;
};

interface Stock {
    id?: string;
    name: string;
    description: string;
    location: string;
    stockEmployee: string | { employeeId: string, firstName: string, lastName: string, role: UserRole }[];
    createdAt?: Date | string;
};

interface Restaurant {
    id?: string;
    name: string;
    description: string;
    location: string;
    restaurantEmployee: string | { employeeId: string, firstName: string, lastName: string, role: UserRole }[];
    createdAt?: Date | string;
};

interface Cafeteria {
    id?: string;
    name: string;
    description: string;
    location: string;
    cafeteriaEmployee: string | { employeeId: string, firstName: string, lastName: string, role: UserRole }[];
    createdAt?: Date | string;
};

interface StockCategory {
    id?: string;
    name: string;
    description: string;
    stockId: string;
};

interface LostObj {
    id?: string;
    name: string;
    description: string;
    location: string;
};

export type StockType = "spa" | "restaurant" | "material";

interface SuppliersDataType {
    supplierName: string;
    supplierPhone: string;
    supplierEmail: string;
    supplierAddress: string;
};

interface StockItem extends SuppliersDataType {
    id?: string;
    name: string;
    description: string;
    category: string;
    sku: string;
    unit: Units | string;
    quantity: number;
    minimumQuantity: number;
    stockId: string;
    unitPrice: number;
    isNeeded?: boolean;
    categoryId?: string;
};

interface ReportType extends ReportCollection {
    content: string;
    receivers: Array<string> | string;
    description: string;
};

interface ReportCollection {
    id: string;
    title: string;
};

interface ReportWithSteroids extends ReportType {
    documentAccess?: Array<any>;
    createdAt?: Date | string;
    createdByEmployeeId?: string | null;
    createdByAdminId?: string | null;
};

interface Menu {
    id?: string;
    name: string;
    description: string;
    items?: Array<string>;
    createdAt?: Date | string;
};

interface RestauMenu extends Menu {
    lunchStartTime: string;
    lunchEndTime: string;
    dinnerStartTime: string;
    dinnerEndTime: string;
    restaurantId: string;
};

interface CafeteriaMenu extends Menu {
    startTime: string;
    endTime: string;
    cafeteriaId: string;
};

type FoodType = "restau" | "cafeteria"
type MealType = "lunch" | "dinner"


interface Restau_CafeteriaItem {
    id?: string;
    name: string;
    description: string;
    category: Restau_CafeteriaItemCategories;
    cafeteriaMenuId: string;
    restauMenuId: string;
    cafeteriaId: string;
    restaurantId: string;
    type: FoodType;
    mealType?: MealType
};

interface StockTransaction {
    id?: string;
    name: string;
    description?: string;
    type: StockTransactionType;
    quantity: number;
    stockItemId: string;
    stockId: string;
    date?: Date | string;
    createdAt?: Date | string;
};

interface Budget {
    restau: {
        id: string;
        amount: number;
    };
    spa: {
        id: string;
        amount: number;
    };
    material: {
        id: string;
        amount: number;
    };
};

interface BudgetModalProps {
    restaurant: number;
    spa: number;
    material: number;
};

interface StockBudget {
    stockId: string;
    id: string;
    amount: number;
    stockName : string;
};

interface UserInfos {
    id: string;
    role: string;
    receivers: Array<string>;
};

interface Stat {
    id: string;
    date: string | Date;
    totalEmployees: number;
    totalEvents: number;
    totalMenuItems: number;
    totalSportsFacilities: number;
    totalStockItems: number;
    totalTransactions: number;
    totalTransactionAmount: number;
    totalCafeteriaMenu: number;
    totalClients: number;
    newClients: number;
    checkIns: number;
    checkOuts: number;
    ClientPrice: number;
    maleClients: number;
    femaleClients: number;
    averageClientAge: number;
    hotelId: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    totalNote: number,
    totalTask: number,
    totalReport: number,
    totalRooms,
    newClients: number,
    checkIns: number,
    checkOuts: number,
    ClientPrice: number,
    ClientAge: number[],
    LocalClient: number,
    maleClients: number,
    femaleClients: number,
};

interface GenderDistribution {
    male: number;
    female: number;
};

interface ReservationSummary {
    id: string;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
};

interface ClientSummary {
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

export type CalendarSummary = {
    title: string;
    start: string;
    end: string;
};


export type AdminSummary = {
    firstName: string;
    lastName: string;
};

interface DashboardStatistics {
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
    calendarSummary: EventStage[];
    adminSummary: AdminSummary;
    subscription: Date;
};

interface Dash {
    data: DashboardData;
};


interface SelfUpdateEmployee {
    firstName?: string;
    lastName?: string;
    address?: string;
    dateOfBirth?: Date | string;
    phoneNumber?: string;
    gender?: UserGender;
    nationality?: string;
    state?: EmployeeState;
    password?: string;
};

interface SelfUpdateAdmin {
    firstName?: string;
    lastName?: string;
    address?: string;
    dateOfBirth?: Date | string;
    phoneNumber?: string;
    gender?: UserGender;
    nationality?: string;
    password?: string;
};

interface StockDashboardData {
    categoryCount: number;
    items: {
        supplierAddress: string;
        supplierName: string;
        supplierPhone: string;
        supplierEmail: string;
        quantity: number;
        stockId: string;
        name: string;
        isNeeded: boolean;
        category: { name: string };
    }[];
    transactions:
    { type: StockTransactionType; transactionAmount: number; stockId: string, createdAt: Date | string }[];
    budgets:
    { amount: number; stockId: string; id: string }[];
    stocks: {
        id: string;
        name: string;
    }[]
};

interface StockDashboardResult {
    data: StockDashboardData;
};

interface ClientHistory {
    id: string;
    firstName: string;
    lastName: string;
    identityCardNumber: string;
    phoneNumber: string;
    nationality: string;
    gender: UserGender;
    createdAt: Date | string;
    updatedAt: Date | string;
};

interface BillTableType {
    quantity: number,
    description: string,
    unitPrice: number
};


interface PendingClients {
    id?: string;
    eventId?: string;
    reservations?: Array<{ id: string, startDate: string | Date, endDate: string | Date }>;
    fullName: string;
    dateOfBirth: Date | string;
    phoneNumber: string;
    email?: string;
    identityCardNumber: string;
    address: string;
    nationality: string;
    membersNumber: number;
    kidsNumber: number;
    gender: UserGender | string;
    clientOrigin: ClientOrigin;
    pendingReservation: Reservation[]
};

interface Pending extends Client, Reservation { reservationId: string };






//regex
const phoneRegex = /^\+?[1-9]\d{1,14}$/;
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;



// components types 


//stat cards types
export type SidebarItemType = {
    icon: IconType;
    title: string;
    url: string;
};

export type FirstCardItemType = {
    id?: string;
    icon: IconType | StaticImageData;
    title: string;
    subject: string;
    currentValue: number;
    increaseValue: number;
};

export type SecondCardItemType = FirstCardItemType & {
    pourcentage: number;
    exiting: number;
    sentence: string;
};

export type ThirdCardItemType = {
    icon: IconType | StaticImageData;
    title: string;
    subject: string;
    subTitle: string;
    currentValue: number;
    pourcentage: number;
};

export type FourthCardItemType = SeventhCardItemType & {
    isDone: boolean;
};

export type FifthCardItemType = {
    id: string;
    icon: StaticImageData;
    title: string;
    currentValue: number;
    subject: string;
    pourcentage: number,
    speciality: string,
};

export type SixthCardItemType = {
    _id: string;
    title: string;
    value: number;
    thisDayValue: number;
    notFoundValue: number;
    availableValue: number;
    categoriesValue: number;
};

export type SeventhCardItemType = {
    id: string;
    title: string;
    description: string;
    date: Date | string;
};

export type JsonFormatCustomtype = {
    [key: string]: string;
};

export type NinthCardItemType = {
    title: string;
    fields: JsonFormatCustomtype;
};

export type DashboardCardType = {
    title: string;
    icon: IconType | StaticImageData;
    value: number;
    subject: string;
    url: string;
    additionalInfo: string;
};


export type BankCardType = {
    type: "CI/DH";
    cardId: string;
    userName: string;
    expiration: Date | string;
};




// modals types


export type ModalProps = {
    isOpen: boolean;
    onOpen: () => void;
    onOpenChange: () => void;
};

export type ModalModeProps<T> = ModalProps & { mode: OperationMode, initialData?: T };

// interface AddStockItemModalProps extends ModalModeProps<StockItem> {
//     categories: Array<StockCategory>;
// };

export type AddEventModalsProps = ModalProps & {
    eventId: string;
};

interface DisplayModalStyle1Props<T1, T2> extends ModalProps {
    data1: T1;
    data2: T2;
    title1: string;
    title2: string;
};

// data grid types

interface Column {
    uid: string;
    name: string;
    sortable?: boolean;
};

//pages types

interface HeroSectionType {
    title: string;
    description: string;
    image: StaticImageData;
    imageDimensions: {
        height: number;
        width: number;
    };
};

interface MainSection {
    buttonText: string;
    AddModal: React.FC<ModalModeProps<T>>;
    mainComponent: React.ComponentType<{ infos: T, url: string, Icon: StaticImageData | IconType }>;
    Icon: StaticImageData | IconType
};

interface SecondMainSection<T> {
    buttonText: string;
    AddModal: React.FC<ModalModeProps<T>>;
    mainComponent: React.ComponentType<{ infos: T, DipslayIcon: StaticImageData, onOpen: () => void, setDisplayedItem: React.Dispatch<React.SetStateAction<T>> }>;
};

interface PageStructureType<T, T1> {
    hero: HeroSectionType;
    main: MainSection;
    fetchFunc: () => Promise<{ [key: string]: T1[] }>;
};

interface PageStructureType2<Restau_CafeteriaItem> {
    main: SecondMainSection;
    fetchFunc: () => Promise<{ [key: string]: Restau_CafeteriaItem[] }>;
};

export type PageStructureGenericType = Restau_CafeteriaItem;
export type DataType = EventInvited | EventOrganiser | Client;
export type CardType = "reservation" | "client";
export type ItemsType = StockItem | Restau_CafeteriaItem;


//charts

export type StockDonutChartsDataType = {
    name: string;
    value1: number;
    value2: number;
};

export type StockBarChartsDataType = {
    name: string;
    value1: number;
    value2: number;
};

export type StockLineChartDataType = {
    name: string;
    value: number;
};

interface TooltipProps {
    active?: boolean
    payload?: Array<{
        name: string
        value: number
    }>
    label?: string
};

export type CircularBarDataType = {
    name: string;
    dataKey1: string;
    dataKey2: string;
    value1: number;
    value2: number;
};
