"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import waitingImage from "/public/waitingImage.svg";
import GenericDisplayTable from '@/app/main/components/other/GenericDisplayTable';
import { getWaitingList } from '@/app/utils/funcs';
import { Pending, PendingClients } from '@/app/types/types';
import { Button, useDisclosure } from '@nextui-org/react';
import { FaPlus } from 'react-icons/fa6';
import UpdateReservationState from '@/app/main/components/modals/forms/UpdateReservationState';
import { ClientOrigin, ReservationState, RoomType, UserGender } from '@/app/types/constants';

export default function WaitingList() {
    const UpdateModal = useDisclosure();
    const [waitingClients, setWaitingClients] = useState<PendingClients[]>([]);

    const columns = [
        { name: "Nom Complet", uid: "fullName" },
        { name: "Date de Naissance", uid: "dateOfBirth" },
        { name: "Numéro de Téléphone", uid: "phoneNumber" },
        { name: "Adresse Email", uid: "email" },
        { name: "Numéro de Carte d'Identité", uid: "identityCardNumber" },
        { name: "Adresse", uid: "address" },
        { name: "Nationalité", uid: "nationality" },
        { name: "Nombre de Membres", uid: "membersNumber" },
        { name: "Nombre d'Enfants", uid: "kidsNumber" },
        { name: "Genre", uid: "gender" },
        { name: "Origine du Client", uid: "clientOrigin" },
        { name: "Numéro de Chambre", uid: "roomNumber" },
        { name: "Type de Chambre", uid: "roomType" },
        { name: "Date de Début", uid: "startDate" },
        { name: "Date de Fin", uid: "endDate" },
        { name: "Nombre Total de Jours", uid: "totalDays" },
        { name: "Prix Total", uid: "totalPrice" },
        { name: "État de la Réservation", uid: "state" },
        { name: "Source de Réservation", uid: "reservationSource" },
        { name: "Identifiant du Client", uid: "clientId" },
        { name: "Canal de Découverte", uid: "discoverChannel" },
        { name: "Identifiant de Réservation", uid: "reservationId" },
    ];

    function transformPendingClientsToPending(clients: PendingClients[]): Pending[] {
        return clients.flatMap((client) =>
            client.pendingReservation.map((reservation) => ({
                ...client,
                ...reservation,
                reservationId: reservation.id || "",
            }))
        );
    }

    async function getClients() {
        const data = await getWaitingList();
        setWaitingClients(data.pendingClients);
    }

    useEffect(() => {
        getClients();
    }, []);

    const data = transformPendingClientsToPending(waitingClients);

    const test: Pending[] = [
        {
            id: "aiziaiz",
            address: "awswas",
            clientId: "awssssss",
            clientOrigin: ClientOrigin.local,
            dateOfBirth: new Date(),
            endDate: new Date(),
            fullName: "sawsa",
            gender: UserGender.male,
            identityCardNumber: "awsssssss",
            kidsNumber: 1,
            membersNumber: 2,
            nationality: "ass",
            phoneNumber: "1826172712",
            roomNumber: "ae",
            roomType: RoomType.double,
            startDate: new Date(),
            state: ReservationState.enAttente,
            totalDays: 3,
            totalPrice: 1000,
            reservationId: "res-001",
        },
        {
            id: "aizi312aiz",
            address: "awswé2as",
            clientId: "aws33sssss",
            clientOrigin: ClientOrigin.local,
            dateOfBirth: new Date(),
            endDate: new Date(),
            fullName: "sawaSsa",
            gender: UserGender.male,
            identityCardNumber: "awsSAssssss",
            kidsNumber: 1,
            membersNumber: 2,
            nationality: "asASs",
            phoneNumber: "182622172712",
            roomNumber: "aerrt",
            roomType: RoomType.double,
            startDate: new Date(),
            state: ReservationState.enAttente,
            totalDays: 3,
            totalPrice: 1000,
            reservationId: "res-002",
        },
    ];

    return (
        <div>
            <section className='relative w-full h-64 p-6 grid grid-cols-[75%,25%] bg-gradient-to-r from-blue-900 to-blue-600 rounded-xl mb-12'>
                <div>
                    <h1 className='text-3xl lg:text-4xl xl:text-5xl font-medium mb-4'>Liste d'Attente des Clients</h1>
                    <p className='text-base md:text-xl font-medium w-2/3 md:pl-8 mb-2 md:w-fit'>
                        Vous gérez le planning des réservations en attente dans cette section et veillez à leur organisation
                        efficace pour une meilleure gestion.
                    </p>
                </div>
                <div>
                    <Image
                        src={waitingImage}
                        alt=''
                        width={300}
                        height={300}
                        className='absolute top-1/4 right-8 sm:top-0 w-44 h-44 md:h-52 md:w-52 md:top-[15%]'
                    />
                </div>
            </section>
            <section className='flex flex-col gap-4'>
                <Button
                    onClick={UpdateModal.onOpen}
                    className='self-end'
                    color='secondary'
                    variant='shadow'
                    endContent={<FaPlus className='size-4' />}
                >
                    Mise à jour d'une réservation
                </Button>
                <UpdateReservationState props={UpdateModal} data={test} />
                <section className='lg:w-[71rem] lg:overflow-hidden w-full overflow-x-scroll'>
                    <GenericDisplayTable columns={columns} data={test} />
                </section>
            </section>
        </div>
    );
}
