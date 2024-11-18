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
            "Gestion des Clients": true,
            "Juste 21 Chambres": true,
            "1 Seul Employé": true,
            "Admin Dashboared": true,
            "Gestion des Evenements" : false,
            "Gestion des Salles de Sport" : false,
            "Gestion du Cafeteria" : false,
            "Gestion du Stock" : false,
            "Gestion des Rapports" : false,
            "Gestion des Tâches/Notes" : false,
        },
    },
    {
        title: "Standard",
        data: {
            "Gestion des Clients": true,
            "Juste 50 Chambres": true,
            "6 Employés": true,
            "Admin Dashboared": true,
            "Gestion des Evenements" : false,
            "Gestion des Salles de Sport" : false,
            "Gestion du Cafeteria" : false,
            "Gestion du Stock" : false,
            "Gestion des Rapports" : true,
            "Gestion des Tâches/Notes" : true,
        },
    },
    {
        title: "Premium",
        data: {
            "Gestion des Clients": true,
            "Chambres illémitées": true,
            "20 Employés": true,
            "Admin Dashboared": true,
            "Gestion des Evenements" : true,
            "Gestion des Salles de Sport" : true,
            "Gestion du Cafeteria" : true,
            "Gestion du Stock" : true,
            "Gestion des Rapports" : true,
            "Gestion des Tâches/Notes" : true,
        },
    },
];

export default function Pricing() {

    const PricingElement: React.FC<PricingProps> = ({ data, title }) => {
        const values = Object.entries(data);
        return (
            <div className={`h-[40rem] w-full md:w-[50%] lg:w-[29%] rounded-xl shadow-md p-4 relative ${title === "Standard" ? "bg-primary-500" : "bg-gray-200 dark:bg-gray-800 dark:bg-opacity-45"}`}>
                <h3 className='text-center text-2xl font-semibold mb-2'>{title} Plan</h3>
                {
                    title === "Basic" ? <h2 className='text-center text-4xl font-semibold text-green-500 mb-6'>Gratuit</h2> 
                    : 
                    <h2 className={`text-center text-4xl font-semibold flex items-end justify-center gap-4 mb-6 ${title === 'Standard' ? "text-black " : "text-green-500"}`}><span>{title === "Standard" ? 6800 : 9600}</span><span className='text-2xl'>DA/mo</span></h2>
    
                }
                <section className='flex flex-col gap-4 mb-8'>
                    {values.map(([key, value]) => (
                        <div key={key} className='flex items-center justify-between'>
                            <span className='text-lg font-medium'>{key}</span> <span><Image src={value ? PlanInclude : PlanNonInclude} alt='' height={50} width={50}/></span>
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
        <div className='w-10/12 mx-auto mb-8 relative' id='pricing-div-container'>
            <Image src={BlueBluredGlowing} alt='img' width={2000} height={2000} className='hidden dark:block dark:absolute dark:top-0 dark:md:top-[-10%] dark:xl:top-[15%] dark:right-0 ' />
            <section className='flex flex-col justify-center items-center gap-6 mb-8'>
                <h1 className='text-3xl text-shadow-md leading-[3rem] lg:text-shadow-lg lg:text-5xl font-semibold lg:leading-[4rem] text-primary'>Prix</h1>
                <p className='text-xl  text-gray-500 text-wrap md:w-1/2'>Choisissez le plan d&#x27;abonnement parfait pour une gestion h&#xF4;tel&#xE8;re sans accroc</p>
            </section>
            <section className='flex flex-col gap-4 lg:flex-row lg:gap-0 items-center justify-between w-full'>
                {
                    pricingData.map((data) => <PricingElement key={data.title} data={data.data} title={data.title} />)
                }
            </section>
        </div>
    )
}
