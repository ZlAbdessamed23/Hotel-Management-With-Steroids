"use client"

import { ReservedRoom } from '@/app/types/types';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import React from 'react'
import { IoEllipsisVertical } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { HiUserAdd } from "react-icons/hi";
import { OperationMode, RoomState, TransformedRoomState } from '@/app/types/constants';
import { changeRoomStatus, deleteRoom } from '@/app/utils/funcs';
import toast from 'react-hot-toast';


export default function RoomCard({ infos, DisplayModalOpen, EditModalOpen, AddReservationModalOpen, setDisplayedRoom, setMode, setRefreshTrigger }: { infos: ReservedRoom, DisplayModalOpen: () => void, EditModalOpen: () => void, AddReservationModalOpen: () => void, setDisplayedRoom: React.Dispatch<React.SetStateAction<ReservedRoom | undefined>>, setMode: React.Dispatch<React.SetStateAction<OperationMode>>, setRefreshTrigger: React.Dispatch<React.SetStateAction<number>> }) {

    function OpenEditRoomModal() {
        setDisplayedRoom(infos);
        setMode(OperationMode.update);
        EditModalOpen();
    };

    function OpenAddReservationModal() {
        console.log(infos);
        setDisplayedRoom(infos);
        AddReservationModalOpen();
    };

    function OpenDisplayRoomModal() {
        setDisplayedRoom(infos);
        DisplayModalOpen();
    };

    async function handleDeleteRoom() {
        const response = await deleteRoom(infos.id as string);
        setRefreshTrigger((curr) => curr + 1);
        return response;
    };

    async function handleChangeRoomStatus() {
        const isFixed = (infos.status === RoomState.outOfOrder || infos.status === RoomState.outOfService) ? true : false; 
        const response = await changeRoomStatus(isFixed , infos.id as string);
        setRefreshTrigger((curr) => curr + 1);
        return response;
    };

    async function deleteTheRoom() {
        const result = handleDeleteRoom();
        await toast.promise(result, {
            loading: 'Loading...',
            success: (data) => `${data}`,
            error: (err) => `${err.toString()}`,
        }
        );
    };

    async function changeStatus() {
        const result = handleChangeRoomStatus();
        await toast.promise(result, {
            loading: 'Loading...',
            success: (data) => `${data}`,
            error: (err) => `${err.toString()}`,
        }
        );
    };



    return (
        <div className='bg-white rounded-lg font-inter w-64 dark:bg-slate-800'>
            <section className='flex flex-row justify-between items-center p-1 border-b border-b-black'>
                <span className={`size-4 ml-2 rounded-full ${infos.status === TransformedRoomState.outOfService ? "bg-warning" : infos.status === TransformedRoomState.free ? "bg-success" : infos.status === TransformedRoomState.reserved ? "bg-danger" : "bg-default"}`}></span>
                <Dropdown>
                    <DropdownTrigger>
                        <Button isIconOnly className='bg-transparent'><IoEllipsisVertical className='size-6' /></Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                        <DropdownItem key="view" onClick={OpenDisplayRoomModal}>
                            Voire
                        </DropdownItem>
                        <DropdownItem key="status" color={(infos.status === RoomState.outOfOrder || infos.status === RoomState.outOfService) ? "success" : "danger"} onClick={changeStatus}>
                            Changer le status de la chambre
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </section>
            <section className='p-1 grid grid-cols-[62%,38%] gap-2 items-center border-b border-b-black'>
                <div className='flex flex-col items-start gap-2 w-full'>
                    <div className='rounded-lg border border-black p-1 text-ellipsis whitespace-nowrap overflow-hidden w-[10.5rem] '>
                        <span className='text-sm font-light opacity-70'>client</span>:<span className='text-base font-medium'>{infos.reservation && infos.reservation.client.fullName || ""}</span>
                    </div>
                    <div className='rounded-lg border border-black p-1 text-ellipsis whitespace-nowrap overflow-hidden w-[10.5rem]'>
                        <span className='text-sm font-light opacity-70'>entr&eacute;e</span>:<span className='text-base font-medium'>{infos.reservation && new Date(infos.reservation?.startDate).toISOString().split('T')[0] || ""}</span>
                    </div>
                    <div className='rounded-lg border border-black p-1 text-ellipsis whitespace-nowrap overflow-hidden w-[10.5rem]'>
                        <span className='text-sm font-light opacity-70'>sortie</span>:<span className='text-base font-medium'>{infos.reservation && new Date(infos.reservation?.endDate).toISOString().split('T')[0] || ""}</span>
                    </div>
                </div>
                <div className='flex flex-col items-center gap-2'>
                    <p className={`font-semibold text-xl ${infos.status === TransformedRoomState.outOfService ? "text-warning" : infos.status === TransformedRoomState.free ? "text-success" : infos.status === TransformedRoomState.reserved ? "text-danger" : "text-default"}`}>{infos.number}</p>
                    <p className={`font-semibold text-xl max-w-24 overflow-x-hidden text-ellipsis ${infos.status === TransformedRoomState.outOfService ? "text-warning" : infos.status === TransformedRoomState.free ? "text-success" : infos.status === TransformedRoomState.reserved ? "text-danger" : "text-default"}`}>{infos.type}</p>
                </div>
            </section>
            <section className='flex justify-between items-center p-1 '>
                <Button isIconOnly className='bg-transparent' onClick={deleteTheRoom}><MdDeleteOutline className='size-7 text-primary' /></Button>
                <Button isIconOnly className='bg-transparent' onClick={OpenAddReservationModal}><HiUserAdd className='size-7 text-primary' /></Button>
                <Button isIconOnly className='bg-transparent' onClick={OpenEditRoomModal}><FiEdit className='size-7 text-primary' /></Button>
            </section>

        </div>
    )
}
