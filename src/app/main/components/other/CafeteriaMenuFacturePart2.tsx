import React from 'react'
import MenuFactureCornerImage from "/public/MenuFactureCornerImage.svg"
import MenuFactureCupImage from "/public/MenuFactureCupImage.svg"
import MenuFactureSmokeImage from "/public/MenuFactureSmokeImage.svg"
import Image from 'next/image'
import { Restau_CafeteriaItem } from '@/app/types/types'
import { Restau_CafeteriaItemCategories } from '@/app/types/constants';

export default function CafeteriaMenuFacturePart2({ items }: { items: Restau_CafeteriaItem[] }) {

    const groupedItems = React.useMemo(() => {
        return items.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push(item);
            return acc;
        }, {} as Record<Restau_CafeteriaItemCategories, Restau_CafeteriaItem[]>);
    }, [items]);

    return (
        <div className='bg-white relative font-snigelt h-full rounded-t-sm shadow-sm text-black'>
            <section className='pl-8 pr-2 pt-2 mb-96'>
                <h1 className='font-medium text-3xl text-center pt-10 mb-4'>Menu</h1>
                {Object.entries(groupedItems).map(([category, categoryItems]) => (
                    <div key={category} className='mb-4'>
                        <section className='flex items-center gap-4'>
                            <span className='h-4 w-4 rounded-full shadow-sm bg-black'></span>
                            <h3 className='font-semibold text-xl mb-2'>{category}</h3>
                        </section>
                        <ul className='pl-8'>
                            {categoryItems.map(item => (
                                <li key={item.id} className='flex items-baseline mb-1 text-lg font-extralight'>
                                    <span className='mr-2 whitespace-nowrap'>{item.name}</span>
                                    <span className='flex-grow border-b border-dotted border-black'></span>
                                </li>))}
                        </ul>
                    </div>
                ))}
            </section>
            <section className='flex flex-col justify-center items-center bg-[#E28520] absolute bottom-0 w-full min-h-40 overflow-hidden pb-4 rounded-b-sm'>
                <Image src={MenuFactureSmokeImage} alt='' width={450} height={450} />
                <Image src={MenuFactureCupImage} alt='' width={65} height={65} />
            </section>
            <Image src={MenuFactureCornerImage} alt='' width={50} height={50} className='absolute top-2 right-2' />
        </div>
    )
}
