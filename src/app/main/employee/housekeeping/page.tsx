"use client"

import React, { useEffect, useState } from 'react'
import CardStyle5 from '../../components/cards/CardStyle5'
import { EventStage, FifthCardItemType, LostObj, RegisteredEmployee } from '@/app/types/types';
import EmployeeImage from "/public/EmployeeImage.svg";
import EmployeeImage2 from "/public/EmployeeImage2.svg";
import { Tabs, Tab, Button, useDisclosure } from '@nextui-org/react';
import GenericDisplayTable from '../../components/other/GenericDisplayTable';
import { ScheduleXCalendar, useNextCalendarApp } from '@schedule-x/react';
import { parseZonedDateTime } from "@internationalized/date";
import { createEventModalPlugin } from '@schedule-x/event-modal';
import {
    viewDay,
    viewMonthAgenda,
    viewMonthGrid,
    viewWeek,
} from '@schedule-x/calendar'
import GenericDataGrid from '../../components/other/GenericDataGrid';
import AddLostObjModal from '../../components/modals/forms/AddLostObjModal';
import '@schedule-x/theme-default/dist/index.css'
import { getHouseKeepingEmployees, getHouseKeepingPlanifications, getLostObjs } from '@/app/utils/funcs';
import DeleteConfirmationModal from '../../components/modals/forms/DeleteConfirmationModal';


export default function HouseKeeping() {
    const DeleteModalProps = useDisclosure();
    const [selectedEvent, setSelectedEvent] = useState<EventStage>();
    const [employees, setEmployees] = useState<RegisteredEmployee[]>([]);
    const [events, setEvents] = useState<{
        title: string;
        id: string;
        start: string;
        end: string;
        description: string;
    }[]>([]);

    const [objs, setObjs] = useState<LostObj[]>([])

    const item: FifthCardItemType = {
        speciality: "male",
        icon: EmployeeImage,
        title: "Nombre d'Employées",
        subject: "Employée",
        currentValue: 0,
        pourcentage: 0,
        id: "wsajwjasj"
    };

    const item2: FifthCardItemType = {
        speciality: "reception dép",
        icon: EmployeeImage2,
        title: "Type d'Employées",
        subject: "Employée",
        currentValue: 0,
        pourcentage: 0,
        id: "sawsaswl",
    };


    const employeeColumns = [
        { name: "Email", uid: "email" },
        { name: "Nom", uid: "firstName" },
        { name: "Prénom", uid: "lastName" },
        { name: "PHONE NUMBER", uid: "phoneNumber" },
        { name: "GENDER", uid: "gender" },
        { name: "Departement", uid: "departement" },
        { name: "Role", uid: "role" },
        { name: "STATE", uid: "state" },
    ];


    const lostObjColumns = [
        { name: "Nom", uid: "name" },
        { name: "Description", uid: "description" },
        { name: "Localisation", uid: "location" },
    ];

    function convertToScheduleXFormat(isoString: string): string {
        const zonedDateTime = parseZonedDateTime(isoString);
        const { year, month, day, hour, minute } = zonedDateTime;
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    };

    async function getPlans() {
        const data = await getHouseKeepingPlanifications();
        const finalData: {
            title: string;
            id: string;
            start: string;
            end: string;
            description: string;
        }[] = data.HouseKeepingPlanification?.map((event) => {
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

    async function getEmployees() {
        const data = await getHouseKeepingEmployees();
        setEmployees(data.Employees);
    };

    async function getObjs() {
        const data = await getLostObjs();
        setObjs(data.LostObjects);
    };

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
        callbacks: {
            onEventClick(calendarEvent) {
                console.log('onEventClick', calendarEvent);
                setSelectedEvent(calendarEvent as EventStage);
                DeleteModalProps.onOpen();
            },
        },
        selectedDate: '2024-11-18',
        plugins: [createEventModalPlugin()],
    });

    useEffect(() => {
        getPlans();
        getObjs();
        getEmployees();
    }, []);

    useEffect(() => {
        if (events && events.length > 0) {
            const existingEvents = calendarApp?.events.getAll();
            const newEvents = events.filter((event) => {
                return !existingEvents?.some((existingEvent) => existingEvent.id === event.id);
            });
            newEvents.forEach((event) => calendarApp?.events.add(event));
        }
    }, [events, calendarApp]);

    return (
        <div className='w-full overflow-x-hidden'>
            {/* <section className='flex flex-col gap-4  xl:gap-0 xl:flex-row xl:items-center xl:justify-between mb-12 px-2'>
                <div className='w-[98%] p-4 rounded-md shadow-md bg-white dark:bg-slate-700'>
                    <section className='flex items-center justify-between'>
                        <h2 className='text-3xl font-semibold'>Les Taches Generales</h2>
                        <Button color='secondary'>Editer</Button>
                    </section>
                    <section>

                    </section>
                </div>
            </section> */}
            <section className='relative w-full h-64 p-6 grid grid-cols-[75%,25%] bg-gradient-to-r from-blue-900 to-blue-600 rounded-xl mb-10'>
                <div>
                    <h1 className='text-3xl lg:text-4xl xl:text-5xl font-medium mb-4'>Gestion du Service de Ménage</h1>
                    <p className='text-base md:text-xl font-medium w-2/3 md:pl-8 mb-2 md:w-fit'>Administrez et suivez les tâches de ménage pour garantir un environnement propre et organisé dans votre établissement.</p>
                </div>
            </section>
            <section>
                <div>
                    <Tabs aria-label="Options" className='w-full' classNames={{
                        base: "w-full",
                        tabList: "w-full flex flex-row items-center justify-between",
                        tab: "w-[10rem]",
                    }}>
                        <Tab key="Employees" title="Employées">
                            <div>
                                <GenericDisplayTable columns={employeeColumns} data={employees} />
                            </div>
                        </Tab>
                        <Tab key="Plan" title="Planification">
                            <div>
                                <ScheduleXCalendar calendarApp={calendarApp} />
                                <DeleteConfirmationModal dataType='calendar' itemId={selectedEvent?.id as string} props={DeleteModalProps} />
                            </div>
                        </Tab>
                        <Tab key="LostObjects" title="Objets Perdus">
                            <div>
                                <GenericDataGrid columns={lostObjColumns} items={objs} comingDataType='lostObj' Add_Edit_Modal={AddLostObjModal} />
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </section>
        </div>
    )
}
