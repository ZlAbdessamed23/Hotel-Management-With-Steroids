"use client"

import React, { useEffect, useState } from 'react'
import CardStyle5 from '../../components/cards/CardStyle5'
import { FifthCardItemType, LostObj } from '@/app/types/types';
import EmployeeImage from "/public/EmployeeImage.svg";
import EmployeeImage2 from "/public/EmployeeImage2.svg";
import { Tabs, Tab, DateValue } from '@nextui-org/react';
import GenericDisplayTable from '../../components/other/GenericDisplayTable';
import { ScheduleXCalendar, useNextCalendarApp } from '@schedule-x/react';
import { parseZonedDateTime } from "@internationalized/date";
import { parseDate } from "@internationalized/date";
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
import { getHouseKeepingPlanifications, getLostObjs } from '@/app/utils/funcs';


export default function HouseKeeping() {
    const [events, setEvents] = useState<{
        title: string;
        id: string;
        start: string;
        end: string;
        description: string;
    }[]>([]);

    const [objs , setObjs] = useState<LostObj[]>([])

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


    const columns = [
        { name: "Nom Complet", uid: "clientName" },
        { name: "PHONE NUMBER", uid: "phoneNumber" },
        { name: "Email", uid: "email" },
        { name: "Numéro de la Carte Nationale", uid: "identittyCardNumber" },
        { name: "ACTIONS", uid: "actions" },
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
        selectedDate: '2024-11-18',
        plugins: [createEventModalPlugin()],
    });

    useEffect(() => {
        getPlans();
        getObjs();
    },[]);



    return (
        <div className='w-full overflow-x-hidden'>
            <section className='flex flex-col gap-4  xl:gap-0 xl:flex-row xl:items-center xl:justify-between mb-12 px-2'>
                <CardStyle5 infos={item} />
                <CardStyle5 infos={item2} />
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
                                <GenericDisplayTable columns={columns} data={[]} />
                            </div>
                        </Tab>
                        <Tab key="Plan" title="Planification">
                            <div>
                                <ScheduleXCalendar calendarApp={calendarApp} />
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
