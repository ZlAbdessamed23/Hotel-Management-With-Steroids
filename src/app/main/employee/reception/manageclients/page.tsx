"use client"

import React, { useEffect, useState } from 'react'
import { Client, SecondCardItemType } from '@/app/types/types';
import { FaPerson } from 'react-icons/fa6';
import { ClientState, ReservationState } from '@/app/types/constants';
import { getClients } from '@/app/utils/funcs';
import CardStyle2 from '@/app/main/components/cards/CardStyle2';
import TasksLineChart from '@/app/main/components/charts/TasksLineChart';
import { RefreshMenuProvider } from '@/app/main/components/RefreshTriggerContext';
import ClientsDataGrid from '@/app/main/components/other/ClientsDataGrid';
import AddClientModal from '@/app/main/components/modals/forms/AddClientModal';

export default function ManageClients() {
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [data, setData] = useState<Client[]>([]);

  async function getAllClients() {
    const data = await getClients();
    const passedData: Client[] = data.clients?.map((client) => {
      if (client.reservations.length > 0) {
        return client.reservations.map((reservation) => ({
          ...client,
          reservations: [{ id: reservation.id, startDate: reservation.startDate, endDate: reservation.endDate }],
          fullName: client.fullName,
          dateOfBirth: client.dateOfBirth,
          phoneNumber: client.phoneNumber,
          identityCardNumber: client.identityCardNumber,
          address: client.address,
          nationality: client.nationality,
          membersNumber: client.membersNumber,
          kidsNumber: client.kidsNumber,
          gender: client.gender,
          email: client.email || '',
        }));
      } else {
        return [{
          ...client,
          reservations: [],
          fullName: client.fullName,
          dateOfBirth: client.dateOfBirth,
          phoneNumber: client.phoneNumber,
          identityCardNumber: client.identityCardNumber,
          address: client.address,
          nationality: client.nationality,
          membersNumber: client.membersNumber,
          kidsNumber: client.kidsNumber,
          gender: client.gender,
          email: client.email || '',
        }];
      }
    }).flat() || [];
    console.log(passedData);
    setData(passedData);
  };

  useEffect(() => {
    getAllClients();
  }, [refreshTrigger]);

  type DayName = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

  type DayCounts = {
    [key in DayName]: {
      checkIns: number;
      checkOuts: number;
    };
  };

  function getReservationsForCurrentWeek(clients: Client[]): { startOfWeek: Date; endOfWeek: Date; dayCounts: DayCounts } {
    const today = new Date();
    const currentDay = today.getDay();

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const dayCounts: DayCounts = {
      Sunday: { checkIns: 0, checkOuts: 0 },
      Monday: { checkIns: 0, checkOuts: 0 },
      Tuesday: { checkIns: 0, checkOuts: 0 },
      Wednesday: { checkIns: 0, checkOuts: 0 },
      Thursday: { checkIns: 0, checkOuts: 0 },
      Friday: { checkIns: 0, checkOuts: 0 },
      Saturday: { checkIns: 0, checkOuts: 0 }
    };

    const dayNames: DayName[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    clients.forEach(client => {
      client.reservations?.forEach(reservation => {
        const startDate = new Date(reservation.startDate as string);
        const endDate = new Date(reservation.endDate as string);

        if (startDate >= startOfWeek && startDate <= endOfWeek) {
          const startDayName = dayNames[startDate.getDay()];
          dayCounts[startDayName].checkIns++;
        }

        if (endDate >= startOfWeek && endDate <= endOfWeek) {
          const endDayName = dayNames[endDate.getDay()];
          dayCounts[endDayName].checkOuts++;
        }
      });
    });

    return {
      startOfWeek,
      endOfWeek,
      dayCounts
    };
  }


  const result = getReservationsForCurrentWeek(data);
  const chartData = [
    ['Day', 'Check-ins', 'Check-outs'],
    ...Object.entries(result.dayCounts).map(([day, counts]) => [
      day,
      counts.checkIns,
      counts.checkOuts
    ])
  ];

  const isToday = (date: string | Date) => {
    const today = new Date();
    const compareDate = new Date(date);

    return (
      today.getDate() === compareDate.getDate() &&
      today.getMonth() === compareDate.getMonth() &&
      today.getFullYear() === compareDate.getFullYear()
    );
  };

  const clientsLeavingToday = data.filter(client => client.reservations?.some(reservation => reservation.endDate && isToday(reservation.endDate))).length || 0;

  const item: SecondCardItemType = {
    id: "",
    icon: FaPerson,
    title: "Clients",
    subject: "clients",
    currentValue: data.length || 0,
    increaseValue: 145,
    exiting: clientsLeavingToday,
    pourcentage: (clientsLeavingToday * 100 / data.length) || 0,
    sentence: "sortent aujourd'hui"
  };

  return (
    <div className='w-full overflow-hidden'>
      <section className='flex flex-col md:flex-row items-center gap-4 mb-12 px-2'>
        <CardStyle2 infos={item} />
        <TasksLineChart data={chartData} title='Clients' />
      </section>
      <section className='w-[99%] overflow-auto'>
        <RefreshMenuProvider setFetchTrigger={setRefreshTrigger}  >
          <ClientsDataGrid data={data} type='client' Add_Edit_Modal={AddClientModal} />
        </RefreshMenuProvider>
      </section>
    </div>
  )
}
