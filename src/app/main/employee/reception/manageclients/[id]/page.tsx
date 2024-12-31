"use client"

import { OperationMode } from '@/app/types/constants';
import { Client, ModalModeProps, Reservation } from '@/app/types/types';
import { notFound } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Button, useDisclosure } from '@nextui-org/react';
import { FaPlus } from 'react-icons/fa6';
import { getClientWithReservation, getEventGuestWithReservation } from '@/app/utils/funcs';
import ClientCard from '@/app/main/components/cards/ClientCard';
import { RefreshMenuProvider } from '@/app/main/components/RefreshTriggerContext';
import AddEventMemberModal from '@/app/main/components/modals/forms/AddEventMemberModal';
import AddGenericReservationModal from '@/app/main/components/modals/forms/AddGenericReservationModal';
import AddMemberModal from '@/app/main/components/modals/forms/AddMemberModal';
import BillModal from '@/app/main/components/other/BillModal';


type ParamsProps = {
    params: { id: string }
    searchParams: { type: "client" | "eventInvited" | "eventWorker" | undefined, resId: string | undefined, eventId: string | undefined }
};

const clientsRoles: Array<string> = ['client', 'eventInvited', 'eventWorker'];

export default function ClientDisplay({ params, searchParams }: ParamsProps) {
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [clientData, setClientData] = useState<Client>();
    const [reservationData, setReservationData] = useState<Reservation>();
    const [membersData, setMembersData] = useState<Client[]>();

    if (!params.id || searchParams.type === undefined || !clientsRoles.includes(searchParams.type)) {
        notFound();
    };

    const ReservationModal = useDisclosure();
    const MemberModal = useDisclosure();
    const FactureModal = useDisclosure();

    const reservationModalProps: ModalModeProps<Reservation> = {
        isOpen: ReservationModal.isOpen,
        onOpen: ReservationModal.onOpen,
        onOpenChange: ReservationModal.onOpenChange,
        mode: OperationMode.add,
        initialData: undefined,
    };

    async function getClientData() {

        const infos = await getClientWithReservation(params.id, searchParams.resId as string);
        if (infos.client.reservations && infos.client.reservations.length > 0) {
            const { reservations, ...client } = infos.client;
            const { member } = reservations[0];
            setClientData(client as Client);
            setReservationData(reservations[0] as Reservation);
            setMembersData(member as Client[]);
        } else {
            setClientData(infos.client as Client);
        };
    };

    async function getGuestData() {
        if (searchParams.eventId) {
            const infos = await getEventGuestWithReservation(searchParams.eventId, params.id);
            if (infos.Attendue.reservation) {
                const { reservation, ...client } = infos.Attendue;
                const { attendues } = reservation;
                setClientData(client as Client);
                setReservationData(reservation as Reservation);
                setMembersData(attendues as Client[]);
            } else {
                setClientData(infos.Attendue as Client);
            };
        }
    };

    function checkOut() {
        FactureModal.onOpen();
    };

    useEffect(() => {
        if (searchParams.eventId) {
            getGuestData();
        }
        else {
            getClientData();
        };
    }, [refreshTrigger]);


    return (
        <div className='flex flex-col gap-8 w-full overflow-hidden'>
            <div className='flex gap-6 items-center justify-end'>
                {
                    (searchParams.resId && clientData && reservationData) && (<><Button variant='solid' className='bg-danger text-white' onClick={() => checkOut()}>Libérer</Button><BillModal reservation={reservationData} infos={clientData} resId={searchParams.resId} props={FactureModal} /></>)
                }
                {
                    reservationData && <Button variant='solid' className='bg-success text-white' endContent={<FaPlus className='size-5' />} onClick={MemberModal.onOpen}>Ajouter un membre</Button>
                }
                <Button variant='solid' className='bg-secondary text-white' endContent={<FaPlus className='size-5' />} onClick={ReservationModal.onOpen}>Ajouter une réservation</Button>
            </div>
            <div className='grid grid-rows-2 lg:grid-cols-2 py-4 pl-12 gap-12'>
                {
                    clientData && <ClientCard index={0} props={clientData as Client} type='client' />
                }
                {
                    reservationData && <ClientCard index={1} props={reservationData as Reservation} type='reservation' />
                }
                {
                    membersData && membersData.length > 0 && membersData.map((member, index) => <ClientCard key={member.id} index={index + 1} props={member} type='client' />)
                }
            </div>
            <RefreshMenuProvider setFetchTrigger={setRefreshTrigger}>
                <div>
                    {
                        searchParams.eventId ? <AddEventMemberModal eventId={searchParams.eventId as string} props={MemberModal} reservationId={reservationData?.id as string} /> : <AddMemberModal props={MemberModal} resId={searchParams.resId as string} />
                    }
                    <AddGenericReservationModal client={clientData} type={searchParams.type} props={reservationModalProps} />
                </div>
            </RefreshMenuProvider>
        </div>
    )
}
