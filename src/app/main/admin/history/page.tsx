"use client"

import { ClientHistory } from '@/app/types/types';
import { getHistory } from '@/app/utils/funcs';
import React, { useEffect, useState } from 'react'
import HistoryTable from '../components/HistoryTable';
import HistoriqueImage from "/public/HistoriqueImage.svg";
import Image from 'next/image';

export default function HistoryPage() {
    const [clients, setClients] = useState<ClientHistory[]>([]);
    async function getClients() {
        const data = await getHistory();
        setClients(data.ClientsHistorique);
    };

    useEffect(() => {
        getClients();
    }, []);

    const columns = [
        { name: "Nom Complet", uid: "fullName" },
        { name: "Numéro de Carte d'Identité", uid: "identityCardNumber" },
        { name: "PHONE NUMBER", uid: "phoneNumber" },
        { name: "ADDRESS", uid: "address" },
        { name: "NATIONALITY", uid: "nationality" },
        { name: "GENDER", uid: "gender" },
    ];

    return (
        <div>
            <section className='relative w-full h-64 p-6 grid grid-cols-[75%,25%] bg-gradient-to-r from-blue-900 to-blue-600 rounded-xl mb-16'>
                <div>
                    <h1 className='text-3xl lg:text-4xl xl:text-5xl font-medium mb-4'>Historique des Clients</h1>
                    <p className='text-base md:text-xl font-medium w-2/3 md:pl-8 mb-2 md:w-fit'>Vous g&eacute;rez tout l&rsquo;historique des clients dans cette section et analysez leurs interactions pour mieux comprendre et anticiper leurs besoins.</p>
                </div>
                <div>
                    <Image src={HistoriqueImage} alt='' width={300} height={300} className='absolute top-1/4 right-8 sm:top-0 w-44 h-44 md:h-52 md:w-52 md:top-[15%]' />
                </div>
            </section>
            <section>
                <HistoryTable data={clients} columns={columns} />
            </section>
        </div>
    )
}
