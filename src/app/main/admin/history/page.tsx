"use client"

import { ClientHistory } from '@/app/types/types';
import { getHistory } from '@/app/utils/funcs';
import React, { useEffect, useState } from 'react'
import HistoryTable from '../components/HistoryTable';

export default function HistoryPage() {
    const [clients , setClients] = useState<ClientHistory[]>([]);
    async function getClients() {
        const data = await getHistory();
        console.log(data.ClientsHistorique);
        setClients(data.ClientsHistorique);
    };

    useEffect(() => {
        getClients();
    },[]);

    const columns = [
        {name: "Nom Complet", uid: "fullName"},
        {name: "Numéro de Carte d'Identité", uid: "identityCardNumber"},
        {name: "PHONE NUMBER", uid: "phoneNumber"},
        {name: "ADDRESS", uid: "address"},
        {name: "NATIONALITY", uid: "nationality"},
        {name: "GENDER", uid: "gender"},
    ];

    

  return (
    <div>
        <HistoryTable data={clients} columns={columns} />
    </div>
  )
}
