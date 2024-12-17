"use client"

import CardStyle3 from '@/app/main/components/cards/CardStyle3'
import { ThirdCardItemType } from '@/app/types/types'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import StockHeroImage from "/public/StockHeroImage.svg";



export default function StockHeroSection({StatisticsFetchFunc} : {
    StatisticsFetchFunc : () => Promise<ThirdCardItemType[]> 
}) {

    const [items, setItems] = useState<ThirdCardItemType[]>([]);

    useEffect(() => {
        const fetchItems = async () => {
            const fetchedItems = await StatisticsFetchFunc();
            setItems(fetchedItems);
        };
        fetchItems();
    }, [StatisticsFetchFunc]);

  return (
    <div className='mb-[38rem] lg:mb-[20rem] xl:mb-40'>
        <section className='text-white relative '>
            <div className='w-full h-64 p-4 grid grid-cols-[75%,25%] bg-gradient-to-r from-blue-900 to-blue-600 rounded-xl relative'>
                <span>
                    <h1 className='text-3xl xl:text-5xl font-medium mb-4'>Stock Management</h1>
                    <p className='text-base md:text-lg font-normal xl:text-xl xl:font-medium pl-8 mb-12'>Vous gérez tout le Stock dans cette section et avez une réflexion approfondie pour organiser votre travail</p>
                </span>
                <span>
                    <Image src={StockHeroImage} alt='' width={300} height={300} className='absolute -top-[15%]'/>
                </span>
            </div>
            <div className='grid grid-rows-3 lg:grid-rows-none gap-4 lg:grid-cols-2 xl:grid-cols-3 items-center mb-12 text-black absolute top-56 w-full pl-10'>
                {
                    items.map((item) => (<CardStyle3 key={item.title} infos={item} />))
                }
            </div>
        </section>
    </div>
  )
}
