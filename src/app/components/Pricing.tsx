"use client"

import React from 'react'
import Image from 'next/image';
import PlanInclude from "/public/PlanInclude.svg";
import PlanNonInclude from "/public/PlanNonInclude.svg";
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import BlueBluredGlowing from "/public/BlueBluredGlowing.svg";

interface JsonObj {
    [key: string]: boolean;
};

interface PricingProps {
    title: 'Basic' | "Standard" | "Premium";
    data: JsonObj;
};

const pricingData: Array<PricingProps> = [
    {
        title: "Basic",
        data: {
            "Gestion des Clients (20 clients)": true,
            "gestion des Chambres (14 chambres)": true,
            "Gestion d'Employées (un seul)": true,
            "Admin Dashboared": false,
            "Admin Statistiques": false,
            "Gestion des Entretiens de Ménage" : true,
            "Gestion d'Historique des Clients (20 clients)" : true,
            "Gestion des Evenements (0 evenements)" : false,
            "Gestion des Salles de Sport" : false,
            "Gestion du Cafeterias" : false,
            "Gestion du Restaurants" : false,
            "Gestion du Stock" : false,
            "Gestion des Rapports" : false,
            "Gestion des Notes (7 notes)" : true,
            "Gestion des Taches" : false,
        },
    },
    {
        title: "Standard",
        data: {
            "Gestion des Clients (105 clients)": true,
            "gestion des Chambres (70 chambres)": true,
            "Gestion d'Employées (10 employées)": true,
            "Admin Dashboared": true,
            "Admin Statistiques": true,
            "Gestion des Entretiens de Ménage" : true,
            "Gestion d'Historique des Clients (150 clients)" : true,
            "Gestion des Evenements (3 evenements)" : true,
            "Gestion des Salles de Sport (3 salles)" : true,
            "Gestion du Cafeterias (une seule)" : true,
            "Gestion du Restaurants (une seule)" : true,
            "Gestion du Stock (2 stocks)" : true,
            "Gestion des Rapports (10 rapports)" : true,
            "Gestion des Notes (7 notes)" : true,
            "Gestion des Taches (30 taches)" : true,
        },
    },
    {
        title: "Premium",
        data: {
            "Gestion des Clients (180 clients)": true,
            "gestion des Chambres (140 chambres)": true,
            "Gestion d'Employées (25 employées)": true,
            "Admin Dashboared": true,
            "Admin Statistiques": true,
            "Gestion des Entretiens de Ménage" : true,
            "Gestion d'Historique des Clients (220 clients)" : true,
            "Gestion des Evenements (10 evenements)" : true,
            "Gestion des Salles de Sport (10 salles)" : true,
            "Gestion du Cafeterias (3 cafétérias)" : true,
            "Gestion du Restaurants (10 restaurants)" : true,
            "Gestion du Stock (6 stocks)" : true,
            "Gestion des Rapports (50 rapports)" : true,
            "Gestion des Notes (10 notes)" : true,
            "Gestion des Taches (75 taches)" : true,
        },
    },
];

export default function Pricing() {

    const PricingElement: React.FC<PricingProps> = ({ data, title }) => {
        const values = Object.entries(data);
        return (
            <div className={`h-[59rem] lg:h-[66rem] xl:h-[59rem] w-full md:w-[50%] lg:w-[29%] rounded-xl shadow-md p-4 relative ${title === "Standard" ? "bg-primary-500" : "bg-gray-200 dark:bg-gray-800 dark:bg-opacity-45"}`}>
                <h3 className='text-center text-2xl font-semibold mb-2'>{title} Plan</h3>
                {
                    title === "Basic" ? <h2 className='text-center text-4xl font-semibold text-green-500 mb-6'>Gratuit</h2> 
                    : 
                    <h2 className={`text-center text-4xl font-semibold flex items-end justify-center gap-4 mb-6 ${title === 'Standard' ? "text-black " : "text-green-500"}`}><span>{title === "Standard" ? 8400 : 12500}</span><span className='text-2xl'>DA/mo</span></h2>
    
                }
                <section className='flex flex-col gap-4 mb-8'>
                    {values.map(([key, value]) => (
                        <div key={key} className='flex items-center justify-between'>
                            <span className='text-base font-normal xl:text-md xl:font-medium'>{key}</span> <span><Image src={value ? PlanInclude : PlanNonInclude} alt='' height={50} width={50}/></span>
                        </div>
                    ))}
                </section>
                <section className='flex items-center justify-center'>
                    <Button onClick={() => getStarted(title)} size='lg' className={`text-xl font-medium hover:scale-105 ${title === "Standard" ? "bg-white text-black" : "bg-primary-500 text-white"}`}>Get Started</Button>
                </section>
            </div>

        )
    };

    const router = useRouter();
    function getStarted(title : string) {
      router.push(`/register?plan=${title}`);
    };
    
    return (
        <div className='w-full px-4 xl:px-0 xl:w-11/12 mx-auto mb-8 relative' id='pricing-div-container'>
            <Image src={BlueBluredGlowing} alt='img' width={2000} height={2000} className='hidden dark:block dark:absolute dark:top-0 dark:md:top-[-10%] dark:xl:top-[15%] dark:right-0 ' />
            <section className='flex flex-col justify-center items-center gap-6 mb-8'>
                <h1 className='text-3xl text-shadow-md leading-[3rem] lg:text-shadow-lg lg:text-5xl font-semibold lg:leading-[4rem] text-primary'>Prix</h1>
                <p className='text-xl  text-gray-500 text-wrap md:w-1/2'>Choisissez le plan d&#x27;abonnement parfait pour une gestion h&#xF4;tel&#xE8;re sans accroc</p>
            </section>
            <section className='flex flex-col gap-4 xl:flex-row xl:gap-0 items-center justify-between w-full'>
                {
                    pricingData.map((data) => <PricingElement key={data.title} data={data.data} title={data.title} />)
                }
            </section>
        </div>
    )
};
