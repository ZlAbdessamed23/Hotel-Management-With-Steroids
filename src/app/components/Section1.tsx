"use client"

import { Button } from '@nextui-org/react'
import React from 'react'
import { IoIosArrowRoundForward } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import LandingCard1 from './LandingCard1';
import PersonsGroup from "/public/PersonsGroup.svg";
import EmployeeImage from "/public/employeeColored.svg";
import { IconType } from 'react-icons';
import Image, { StaticImageData } from 'next/image';
import LandingHero from "/public/LandingHero.svg";



const cards : {Icon : StaticImageData | IconType , title : string , text : string}[] = [
    {
        Icon: IoSettingsOutline,
        title: "Opération",
        text: "Notre système de gestion hôtelière est conçu pour simplifier vos opérations, rendant vos tâches plus faciles et efficaces.",
    },
    {
        Icon: PersonsGroup,
        title: "Invités",
        text: "Offrez un service exceptionnel et améliorez l'expérience de vos clients. Notre système vous aide à rester organisé."
    },
    {
        Icon: EmployeeImage,
        title: "Staff",
        text: "Donnez à votre équipe les outils nécessaires pour exceller. De la gestion des tâches à la communication, notre système couvre tous vos besoins."
    },


];

export default function Section1() {

    return (
        <div className='relative h-fit lg:-[110vh] w-full overflow-x-hidden font-sans' id='hero-div-container'>
            <div className='first-section-landing-page-container w-10/12 mx-auto h-[100vh] font-inter flex items-start mt-12'>
                <section className='flex items-center gap-4 tracking-wide w-1/2'>
                    <div className='flex flex-col justify-center gap-8 mt-16'>
                        <h1 className='text-3xl text-shadow-md leading-[3rem] lg:text-shadow-lg lg:text-5xl font-semibold lg:leading-[4rem]'>Bienvenu Dans Notre Systeme de <span className='text-landing-pink'>Gestion Hoteliere</span></h1>
                        <p className='text-xl pr-20 text-gray-500 '>Chez HotyVerse, nous offrons une <span className='text-landing-pink'>solution complète pour optimiser et simplifier</span> chaque aspect de la gestion de votre hôtel.</p>
                        <section className='flex items-center gap-4 md:ml-12'>
                            <Button size='lg' className='bg-gradient-to-r from-secondary-500 to-landing-pink text-white' endContent={<IoIosArrowRoundForward className='size-6' />}>Get Started</Button>
                            <Button size='lg'>Learn More</Button>
                        </section>
                    </div>
                </section>
                <section>
                    <Image src={LandingHero} alt='' width={500} height={500} className='absolute w-96 h-96 md:w-[31rem] md:h-[31rem] md:block ml-16' />
                </section>
            </div>
            <div className='h-fit grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-10/12 mx-auto absolute bottom-[-30rem] sm:-bottom-96 md:-bottom-64 lg:-bottom-24 left-[8%]'>
                {
                    cards.map((card) => (<LandingCard1 key={card.title} Icon={card.Icon} title={card.title} text={card.text} />))
                }
            </div>
        </div>

    )
}
