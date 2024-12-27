"use client"

import '@schedule-x/theme-default/dist/index.css'
import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import {
  viewDay,
  viewMonthAgenda,
  viewMonthGrid,
  viewWeek,
} from '@schedule-x/calendar'
import '@schedule-x/theme-default/dist/index.css'
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { ScheduleXCalendar, useNextCalendarApp } from "@schedule-x/react";
import { Button, Calendar, DateValue, useDisclosure } from '@nextui-org/react';
import { parseDate } from "@internationalized/date";
import { FaPlus } from 'react-icons/fa6';
import AddEventPlanStageModal from '../components/modals/forms/AddEventPlanStageModal';
import { getCalendarEventStages } from '@/app/utils/funcs';
import { parseZonedDateTime } from "@internationalized/date";
import CustomEventTimeline from '../components/custom/CustomEventTimeline';
import DeleteConfirmationModal from '../components/modals/forms/DeleteConfirmationModal';
import { EventStage } from '@/app/types/types';
import { RefreshMenuContext } from '../components/RefreshTriggerContext';
import { EventContextProvider } from '../components/EventContextProvider';

function CalendarApp() {

  const AddModalProps = useDisclosure();
  const DeleteModalProps = useDisclosure();
  const [selectedEvent, setSelectedEvent] = useState<EventStage>();
  const [events, setEvents] = useState<{
    title: string;
    id: string;
    start: string;
    end: string;
    description: string;
  }[]>([]);
  const [mounted, setMounted] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();


  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const [value, setValue] = React.useState<DateValue>(parseDate(`${year}-${month}-${day}`));
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  function convertToScheduleXFormat(isoString: string): string {
    const zonedDateTime = parseZonedDateTime(isoString);
    const { year, month, day, hour, minute } = zonedDateTime;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  };

  async function getEvents() {
    const data = await getCalendarEventStages();
    const finalData: {
      title: string;
      id: string;
      start: string;
      end: string;
      description: string;
    }[] = data.Calendars.map((event) => {
      return {
        id: event.id || String(Math.random()),
        description: event.description,
        start: convertToScheduleXFormat(event.start.toString()),
        end: convertToScheduleXFormat(event.end.toString()),
        title: event.title,
      }
    });
    setEvents(finalData);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    getEvents();
  }, [refreshTrigger]);


  const calendarApp = useNextCalendarApp({
    views: [viewWeek, viewMonthGrid, viewDay, viewMonthAgenda],
    defaultView: viewWeek.name,
    events: events,
    // calendars: {
    //   hotel: {
    //     colorName: "hotel",
    //     lightColors: {
    //       main: "#4169E1",
    //       container: "#D9E6FD",
    //       onContainer: "#000000",
    //     },
    //     darkColors: {
    //       main: "#1E293B",
    //       container: "#1E293B",
    //       onContainer: "#1E293B",
    //     },
    //   },
    // },
    selectedDate: '2024-09-24',
    callbacks: {
      onEventClick(calendarEvent) {
        console.log('onEventClick', calendarEvent);
        setSelectedEvent(calendarEvent as EventStage);
        DeleteModalProps.onOpen();
      },
    },
    plugins: [createEventModalPlugin()],
  });

  useEffect(() => {
    if (events && events.length > 0) {
      const existingEvents = calendarApp?.events.getAll();
      const newEvents = events.filter((event) => {
        return !existingEvents?.some((existingEvent) => existingEvent.id === event.id);
      });
      newEvents.forEach((event) => calendarApp?.events.add(event));
    }
  }, [events, calendarApp]);

  if (!mounted) return;
  return (
    <div className='w-full p-2 flex flex-col md:grid md:grid-cols-[30%,70%] gap-4'>
      <section>
        <div className='flex items-center justify-center mb-4'>
          <Calendar
            aria-label="Calendrier"
            value={value}
            onChange={setValue}
            className='dark:bg-slate-800'
            isReadOnly
          />
        </div>
        <div className='mb-4'>
          <Button className='bg-secondary ml-3 text-white w-11/12' endContent={<FaPlus className='size-5' />} onClick={AddModalProps.onOpen}>
            Ajouter un evenement
          </Button>
          <EventContextProvider eventId='' setStagesRefreshTrigger={setRefreshTrigger} stagesRefreshTrigger={refreshTrigger} clientsRefreshTrigger={refreshTrigger} setClientsRefreshTrigger={setRefreshTrigger}>
            <AddEventPlanStageModal props={AddModalProps} type='calendar' />
            <DeleteConfirmationModal dataType='calendar' itemId={selectedEvent?.id as string} props={DeleteModalProps} />
          </EventContextProvider>
        </div>
        <div>
          <CustomEventTimeline events={events} />
        </div>
      </section>
      <section className='overflow-hidden'>
        <ScheduleXCalendar calendarApp={calendarApp} />
      </section>
    </div>
  )
}

export default CalendarApp

