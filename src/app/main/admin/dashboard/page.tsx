import React from 'react'
import DashboardCard from '../../components/cards/DashboardCard'
import { BankCardType, ClientSummary, DashboardCardType, DashboardData, EventStage, StockLineChartDataType } from '@/app/types/types';
import { BsPersonCheckFill } from 'react-icons/bs';
import BankCard from '../../components/cards/BankCard';
import GenericDisplayTable from '../../components/other/GenericDisplayTable';
import ReAreaChart from '../components/ReAreaChart';
import { CircularProgress } from '@nextui-org/react';
import ReBarChart from '../components/ReBarchart';
import CustomEventTimeline from '../../components/custom/CustomEventTimeline';
import Link from 'next/link';
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { headers } from 'next/headers';
import { getDashboardData } from '@/app/utils/funcs';
import { FaBed, FaBaseballBatBall, FaUserGroup } from "react-icons/fa6";
import { parseZonedDateTime } from "@internationalized/date";


interface WeeklyReservationStats {
  name: string;
  value: number;
}

export default async function Dashboard() {

  const emptyDashboardData: DashboardData = {
    statistics: {
      employeeCount: 0,
      employeeGenderDistribution: { male: 0, female: 0 },
      roomCount: 0,
      availableRoomCount: 0,
      clientCount: 0,
      sportsFacilityCount: 0,
      clientGenderDistribution: { male: 0, female: 0 },
      coachCount: 0
    },
    adminSummary: {
      firstName: "",
      lastName: "",
    },
    calendarSummary: [],
    clientSummary: [],
    subscription: new Date(),
  };

  const headersList = headers();
  const token = headersList.get('cookie') || '';
  const dashData = await getDashboardData(token);
  const { statistics, clientSummary, adminSummary, calendarSummary, subscription } = dashData?.data;

  const employeesNbr = statistics?.employeeCount || 0;
  const clientsNbr = statistics?.clientCount || 0;
  const roomsNbr = statistics?.roomCount || 0;
  const sportHallsNbr = statistics?.sportsFacilityCount || 0;

  const employeesMaleNbr = statistics?.employeeGenderDistribution?.male || 0;
  const clientsMaleNbr = statistics?.clientGenderDistribution?.male || 0;
  const availableRoomsNbr = statistics?.availableRoomCount || 0;
  const coachesNbr = statistics?.coachCount || 0;

  function getWeeklyReservations(clientSummary: ClientSummary[]): WeeklyReservationStats[] {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);

    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const weeklyStats = dayNames.map(name => ({ name, value: 0 }));

    clientSummary?.forEach(client => {
      client.reservations?.forEach(reservation => {
        const reservationDate = new Date(reservation.startDate);
        const diffTime = reservationDate.getTime() - startOfWeek.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays < 7) {
          weeklyStats[diffDays].value += 1;
        }
      });
    });

    return weeklyStats;
  };

  const weeklyClientsData = getWeeklyReservations(clientSummary);

  function getWeeklyReservationRevenue(data: ClientSummary[]): StockLineChartDataType[] {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyRevenue: StockLineChartDataType[] = [
      { name: 'Sunday', value: 0 },
      { name: 'Monday', value: 0 },
      { name: 'Tuesday', value: 0 },
      { name: 'Wednesday', value: 0 },
      { name: 'Thursday', value: 0 },
      { name: 'Friday', value: 0 },
      { name: 'Saturday', value: 0 },
    ];

    data?.forEach(client => {
      client.reservations.forEach(reservation => {
        const reservationStart = new Date(reservation.startDate);
        const diffTime = reservationStart.getTime() - startOfWeek.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays >= 0 && diffDays < 7) {
          weeklyRevenue[diffDays].value += reservation.totalPrice;
        }
      });
    });

    return weeklyRevenue;
  }

  const clientsPrices = getWeeklyReservationRevenue(clientSummary);

  const getAdultClientsCount = (clients: ClientSummary[]) => {
    const currentDate = new Date();

    return clients.filter(client => {
      const birthDate = new Date(client.dateOfBirth);
      const age = currentDate.getFullYear() - birthDate.getFullYear();
      const hasBirthdayOccurred =
        currentDate.getMonth() > birthDate.getMonth() ||
        (currentDate.getMonth() === birthDate.getMonth() &&
          currentDate.getDate() >= birthDate.getDate());

      const finalAge = hasBirthdayOccurred ? age : age - 1;
      return finalAge >= 18;
    }).length;
  };

  const adultClientsCount = getAdultClientsCount(clientSummary);

  const clientColumns = [
    { name: "Nom Complet", uid: "fullName" },
    { name: "DATE OF BIRTH", uid: "dateOfBirth" },
    { name: "PHONE NUMBER", uid: "phoneNumber" },
    { name: "ADDRESS", uid: "address" },
    { name: "Numéro de Carte d'identité", uid: "identityCardNumber" },
    { name: "GENDER", uid: "gender" },
    { name: "Nombre des membres", uid: "membersNumber" },
  ];

  const clientCard: DashboardCardType = {
    title: "Nombre des Clients",
    subject: "Clients",
    url: "/main/employee/reception/manageclients",
    value: clientsNbr,
    additionalInfo: `${clientsMaleNbr} males`,
    icon: BsPersonCheckFill,
  };

  const roomCard: DashboardCardType = {
    title: "Nombre des Chambres",
    subject: "Chambres",
    url: "/main/employee/reception/managerooms",
    value: roomsNbr,
    additionalInfo: `${availableRoomsNbr} libres`,
    icon: FaBed,
  };

  const employeeCard: DashboardCardType = {
    title: "Nombre des Employés",
    subject: "Employés",
    url: "/main/admin/manageemployees",
    value: employeesNbr,
    additionalInfo: `${employeesMaleNbr} male`,
    icon: FaUserGroup,
  };

  const gymCard: DashboardCardType = {
    title: "Nombre des SDS",
    subject: "Salles",
    url: "/main/employee/reception/managegyms",
    value: sportHallsNbr,
    additionalInfo: `${coachesNbr} entraineurs`,
    icon: FaBaseballBatBall,
  };

  const currentDate = new Date();
  const expirationDate = new Date();
  expirationDate.setDate(currentDate.getDate() + 3);

  const bankCard: BankCardType = {
    cardId: "16279189318393819",
    type: "CI/DH",
    expiration: new Date(subscription).toISOString().split('T')[0],
    userName: `${adminSummary.firstName} ${adminSummary.firstName}`,
  };

  function convertToScheduleXFormat(isoString: string): string {
    const zonedDateTime = parseZonedDateTime(isoString);
    const { year, month, day, hour, minute } = zonedDateTime;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  };

  const eventStages: EventStage[] = calendarSummary.map((event) => {
    return {
      ...event, start: convertToScheduleXFormat(event.start.toString()), end: convertToScheduleXFormat(event.end.toString())
    }
  });

  return (
    <div className='w-full overflow-x-hidden'>
      <section className='w-full h-64 p-6 rounded-xl text-white relative mb-[45rem] md:mb-40'>
        <div className='dashboared-hero-section w-full h-full p-6 rounded-xl'>
          <h1 className='text-3xl lg:text-4xl xl:text-5xl font-medium mb-4'>Bonjour Administrateur</h1>
          <p className='text-base md:text-xl font-medium pl-8 mb-12'>Vous pouvez consulter toutes les informations relatives à l&#39;h&ocirc;tel sur cette page et prendre une d&eacute;cision en toute connaissance de cause</p>
        </div>
        <div className='pl-12 grid items-center justify-center grid-rows-4 lg:pl-1 lg:grid-rows-none lg:grid-cols-4 gap-5 mb-12 text-black absolute top-56'>
          <DashboardCard infos={clientCard} bgColor='bg-success' />
          <DashboardCard infos={employeeCard} bgColor='bg-secondary' />
          <DashboardCard infos={roomCard} bgColor='bg-warning' />
          <DashboardCard infos={gymCard} bgColor='bg-primary' />
        </div>
      </section>
      <section className='w-full p-4 rounded-xl text-white grid grid-rows-2 lg:grid-rows-none lg:grid-cols-[68%,28%] gap-3'>
        <div className='w-[25rem] lg:w-full flex flex-col gap-8'>
          <span className='h-[30rem] w-full pr-8 pt-8 pb-12 bg-white rounded-xl text-black dark:bg-slate-800'>
            <div className='text-black mb-10 pl-12 text-xl font-semibold font-segoe dark:text-white'>
              Revenu
            </div>
            <ReAreaChart title='Prix totale' data={clientsPrices} />
          </span>
          <span className='grid grid-rows-2 lg:grid-rows-none lg:grid-cols-[60%,40%] gap-4 px-4'>
            <div className='h-[13rem] w-full pr-8 pt-2 pb-2 bg-white rounded-xl text-black dark:bg-slate-800 dark:text-white'>
              <ReBarChart data={weeklyClientsData} title='Nombre des Clients' />
            </div>
            <div className='bg-white rounded-xl p-4 h-[13rem] dark:bg-slate-800'>
              <CircularProgress
                classNames={{
                  base: "ml-14",
                  svg: "w-36 h-36 drop-shadow-md",
                  indicator: "stroke-[#006FEE]",
                  track: "stroke-black/10",
                  value: "text-3xl font-semibold text-black dark:text-gray-50",
                }}
                value={(adultClientsCount * 100 / clientSummary?.length) || 0}
                strokeWidth={4}
                showValueLabel={true}
              />
              <section className='px-6 flex items-center justify-between py-2 text-black dark:text-white'>
                <div className='flex items-center gap-1'>
                  <span className='h-4 w-4 bg-primary rounded-md'></span>
                  <p>Adults</p>
                </div>
                <div className='flex items-center gap-1'>
                  <span className='h-4 w-4 bg-gray-300 rounded-md'></span>
                  <p>Clients</p>
                </div>
              </section>
            </div>
          </span>
          <span className='max-w-[47rem]'>
            <GenericDisplayTable columns={clientColumns} data={clientSummary} />
          </span>
        </div>
        <div>
          <BankCard infos={bankCard} />
          <section className='bg-white p-4 rounded-t-xl shadow-sm w-[21.5rem] h-[30rem] text-black mb-1 dark:bg-slate-800 dark:text-white'>
            <h2 className='text-3xl font-semibold mb-2' >Calendrier</h2>
            <CustomEventTimeline events={eventStages} />
          </section>
          <section className='flex items-center justify-center gap-1 p-4 bg-white rounded-b-lg group transition-transform w-[21.5rem] dark:bg-slate-800'>
            <Link href="/main/hoteleventsschedular" className='text-secondary text-lg font-light'>Voire tous les &eacute;vennements</Link>
            <MdOutlineKeyboardArrowRight className="size-7 text-secondary transition-transform duration-300 group-hover:translate-x-1" />
          </section>
        </div>
      </section>
    </div>
  )
}
