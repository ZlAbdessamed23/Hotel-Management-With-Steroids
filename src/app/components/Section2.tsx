import Image, { StaticImageData } from 'next/image'
import React from 'react'
import SystemScreenShot from "/public/SystemScreenShot.svg";
import landingItemsImage5 from "/public/landingItemsImage5.svg";
import landingItemsImage4 from "/public/landingItemsImage4.svg";
import landingItemsImage3 from "/public/landingItemsImage3.svg";
import landingItemsImage2 from "/public/landingItemsImage2.svg";
import landingItemsImage from "/public/landingItemsImage1.svg";
import Link from 'next/link';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { Button } from '@nextui-org/react';



const ItemDisplay: React.FC<{ icon: StaticImageData, title: string , index : number }> = (props) => {
    return (
        <div className='flex flex-col items-center'>
            <Image src={props.icon} alt='' width={50} height={50} />
            <p className={` ${props.index === 3 ? "bg-gradient-to-r from-gray-400 to-transparent bg-clip-text text-transparent" :""}`}>{props.title}</p>
        </div>
    )
};

const CardDisplay : React.FC = () =>  (
    <div className='w-full grid-rows-2 py-4 px-2 rounded-lg shadow-md bg-gray-200 grid md:grid-rows-none xl:grid-cols-[50%,50%] gap-0 dark:bg-gray-800'>
        <section className='flex items-center justify-center'>
            <Image src={landingItemsImage5} alt='' width={200} height={200} />
        </section>
        <section>
            <h2 className='text-primary-500 text-3xl font-semibold mb-4'>Gestion des Chambres</h2>
            <p className='text-2xl font-medium mb-4 text-gray-700 dark:text-white'>Dans cette section, vous pouvez gérer tous les aspects liés aux chambres et à leur statut.</p>
            <div className='flex items-center justify-between font-semibold '>
                <span className='bg-landing-pink p-2 shadow-lg shadow-pink-300 rounded-lg text-xl dark:shadow-md'>Réservation</span>
                <span className='p-2 bg-transparent border border-landing-pink rounded-lg text-landing-pink'>Ménage</span>
                <span className='p-2 bg-transparent border border-landing-pink rounded-lg text-landing-pink'>Maintenance</span>
            </div>
        </section>
    </div>
)
const items : Array<{icon : StaticImageData , title : string}> = [
    {
        icon : landingItemsImage,
        title : "chambres"
    },
    {
        icon : landingItemsImage2,
        title : "employés"
    },
    {
        icon : landingItemsImage3,
        title : "clients"
    },
    {
        icon : landingItemsImage4,
        title : "restaurant"
    },
]

export default function Section2() {
    return (
        <div className='ml-8 md:ml-16 xl:ml-24 overflow-x-hidden max-w-screen'>
            <section className='mb-4'>
                <h1 className='text-3xl text-shadow-md leading-[3rem] lg:text-shadow-lg lg:text-5xl font-semibold lg:leading-[4rem] text-landing-pink'>D&eacute;couvrir Notre Syst&egrave;me</h1>
                <p className='text-xl pl-1 text-gray-500 w-1/2'>Am&eacute;liorez la collaboration de votre &eacute;quipe avec notre outil qui int&egrave;gre la gestion des t&acirc;ches, la messagerie et les rapports.</p>
            </section>
            <section className='grid grid-rows-2 md:grid-rows-none md:grid-cols-[50%,50%] lg:grid-cols-[50%,45%] gap-16'>
                <div className='pt-12 flex flex-col gap-8'>
                    <section className='flex items-center justify-between w-[28rem]'>
                        {
                            items.map((item , index) => (<ItemDisplay key={item.title} icon={item.icon} index={index} title={item.title} />))
                        }
                    </section>
                    <section>
                        <CardDisplay />
                    </section>
                    <section>
                    <Button size='lg' className='bg-gradient-to-r from-secondary-500 to-landing-pink text-white' endContent={<IoIosArrowRoundForward className='size-6' />}>Voire Plus</Button>
                    </section>
                </div>
                <div>
                    <Image src={SystemScreenShot} alt='' width={700} height={700} className='w-full h-full' />
                </div>
            </section>
        </div>
    )
}
