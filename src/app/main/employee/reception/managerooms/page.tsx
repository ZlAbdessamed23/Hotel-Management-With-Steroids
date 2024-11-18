"use client"

import React, { useEffect, useState } from 'react'
import { ReservedRoom, Room, SecondCardItemType } from '@/app/types/types';
import { FaBed, FaPlus } from "react-icons/fa6";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, useDisclosure, Selection } from '@nextui-org/react';
import { FaSearch } from 'react-icons/fa';
import { RoomState, OperationMode } from '@/app/types/constants';
import { MdArrowDropDown } from "react-icons/md";
import { getAllRooms } from '@/app/utils/funcs';
import CardStyle2 from '@/app/main/components/cards/CardStyle2';
import RoomLineChart from '@/app/main/components/charts/RoomLineChart';
import { RefreshMenuProvider } from '@/app/main/components/RefreshTriggerContext';
import AddRoomModal from '@/app/main/components/modals/forms/AddRoomModal';
import DisplayModalStyle2 from '@/app/main/components/modals/display/DisplayModalStyle2';
import AddMemberModal from '@/app/main/components/modals/forms/AddMemberModal';
import RoomCard from '@/app/main/components/other/RoomCard';

export default function ManageRooms() {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [selectedRoomType, setSelectedRoomType] = useState<Selection>(new Set(["tout"]));
    const [displayedRoom, setDisplayedRoom] = useState<ReservedRoom>();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [mode, setMode] = useState<OperationMode>(OperationMode.add);
    const [allRooms, setAllRooms] = useState<Array<ReservedRoom>>([]);
    const [filteredRooms, setFilteredRooms] = useState<Array<ReservedRoom>>([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const DisplayModal = useDisclosure();
    const ReservationModal = useDisclosure();

    const handleSelectionChange = (keys: Selection) => {
        if (keys === "all" || keys.size === 0) {
            setSelectedRoomType(new Set(["tout"]));
        } else {
            setSelectedRoomType(keys);
        }
    };

    const getButtonColor = () => {
        const selected = Array.from(selectedRoomType)[0] as string;
        switch (selected) {
            case "tout": return "primary";
            case "en_panne": return "warning";
            case "disponible": return "success";
            case "reservee": return "danger";
            default: return "default";
        }
    };

    useEffect(() => {
        async function getRooms() {
            const data = await getAllRooms();
            setAllRooms(data.rooms);
            setFilteredRooms(data.rooms);
        }
        getRooms();
    }, [refreshTrigger]);

    useEffect(() => {
        let result = [...allRooms];
        const selected = Array.from(selectedRoomType)[0] as string;
        
        if (selected !== "tout") {
            result = result.filter(room => room.status.toLowerCase() === selected.toLowerCase());
        }

        if (searchTerm.trim() !== "") {
            result = result.filter(room => 
                room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                room.number.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredRooms(result);
    }, [searchTerm, selectedRoomType, allRooms]);

    useEffect(() => {
        if (!isOpen) {
            setDisplayedRoom(undefined);
            setMode(OperationMode.add);
        }
    }, [isOpen]);

    const roomNbr = allRooms?.length || 0;
    const freeRoomNbr = allRooms?.filter((room) => room.status === RoomState.free).length || 0;

    const cardItem: SecondCardItemType = {
        icon: FaBed,
        title: "Chambres",
        subject: "chambres",
        currentValue: roomNbr,
        increaseValue: 0,
        exiting: freeRoomNbr,
        pourcentage: (freeRoomNbr * 100 / roomNbr) || 0,
        sentence: "chambre libre"
    };

    type DayName = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

    type DayCounts = {
        [key in DayName]: {
            checkIns: number;
            checkOuts: number;
        };
    };

    function getRoomStatsForCurrentWeek(rooms: ReservedRoom[]): {
        startOfWeek: Date;
        endOfWeek: Date;
        dayCounts: DayCounts;
    } {
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

        rooms?.forEach(room => {
            const startDate = new Date(room?.reservation?.startDate);
            const endDate = new Date(room?.reservation?.endDate);

            if (startDate >= startOfWeek && startDate <= endOfWeek) {
                const dayName = dayNames[startDate.getDay()];
                dayCounts[dayName].checkIns++;
            }

            if (endDate >= startOfWeek && endDate <= endOfWeek) {
                const dayName = dayNames[endDate.getDay()];
                dayCounts[dayName].checkOuts++;
            }
        });

        return {
            startOfWeek,
            endOfWeek,
            dayCounts
        };
    }

    const result = getRoomStatsForCurrentWeek(allRooms);
    const data = [
        ['Jours', 'Arrivées', 'Départs'],
        ['Dimanche', result.dayCounts.Sunday.checkIns, result.dayCounts.Sunday.checkOuts],
        ['Lundi', result.dayCounts.Monday.checkIns, result.dayCounts.Monday.checkOuts],
        ['Mardi', result.dayCounts.Tuesday.checkIns, result.dayCounts.Tuesday.checkOuts],
        ['Mercredi', result.dayCounts.Wednesday.checkIns, result.dayCounts.Wednesday.checkOuts],
        ['Jeudi', result.dayCounts.Thursday.checkIns, result.dayCounts.Thursday.checkOuts],
        ['Vendredi', result.dayCounts.Friday.checkIns, result.dayCounts.Friday.checkOuts],
        ['Samedi', result.dayCounts.Saturday.checkIns, result.dayCounts.Saturday.checkOuts],
    ];

    return (
        <div className='flex flex-col gap-12 w-full overflow-x-hidden'>
            <section className='flex flex-col md:flex-row items-center gap-4 mb-12 px-2'>
                <CardStyle2 infos={cardItem} />
                <RoomLineChart data={data} />
            </section>
            <section>
                <section className='flex flex-col gap-4 sm:gap-0 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='w-4/5'>
                        <Input
                            startContent={<FaSearch />}
                            value={searchTerm}
                            onValueChange={setSearchTerm}
                            classNames={{
                                inputWrapper: "border border-gray-500 dark:bg-slate-800"
                            }}
                            isClearable
                            className="sm:w-[10rem] w-full lg:w-[20rem]"
                            placeholder="La Recherche par Nom ..."
                        />
                    </div>
                    <div className='flex items-center gap-8'>
                        <Dropdown>
                            <DropdownTrigger>
                                <Button
                                    endContent={<MdArrowDropDown className='size-5' />}
                                    color={getButtonColor()}
                                    className='text-white'
                                >
                                    {Array.from(selectedRoomType)[0] as string}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                selectionMode="single"
                                selectedKeys={selectedRoomType}
                                onSelectionChange={handleSelectionChange}
                            >
                                <DropdownItem key="tout">Tout</DropdownItem>
                                <DropdownItem key="disponible" color='success'>disponible</DropdownItem>
                                <DropdownItem key="reservee" color='danger' className='text-danger'>reservee</DropdownItem>
                                <DropdownItem key="hors_service" color='warning'>hors service</DropdownItem>
                                <DropdownItem key="en_panne" color='default'>en panne</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <Button className='bg-secondary text-white' endContent={<FaPlus className='size-5' />} onClick={onOpen}>
                            Ajouter une nouvelle Chambre
                        </Button>
                        <RefreshMenuProvider setFetchTrigger={setRefreshTrigger}>
                            <AddRoomModal isOpen={isOpen} mode={mode} onOpen={onOpen} onOpenChange={onOpenChange} initialData={displayedRoom as Room} />
                            {displayedRoom && 
                                <DisplayModalStyle2 
                                    data1={displayedRoom} 
                                    title1='Voire la Chambre' 
                                    props={DisplayModal} 
                                />
                            }
                            <AddMemberModal 
                                props={ReservationModal} 
                                resId={displayedRoom?.reservation?.id || ""} 
                            />
                        </RefreshMenuProvider>
                    </div>
                </section>
            </section>
            <section className='flex flex-col items-center sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                {filteredRooms?.map((room) => (
                    <RoomCard 
                        key={room?.id} 
                        setRefreshTrigger={setRefreshTrigger} 
                        AddReservationModalOpen={ReservationModal.onOpen} 
                        DisplayModalOpen={DisplayModal.onOpen} 
                        setMode={setMode} 
                        EditModalOpen={onOpen} 
                        setDisplayedRoom={setDisplayedRoom} 
                        infos={room} 
                    />
                ))}
            </section>
        </div>
    )
}