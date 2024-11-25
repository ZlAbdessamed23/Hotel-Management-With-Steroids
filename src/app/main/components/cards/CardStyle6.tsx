import { SixthCardItemType } from '@/app/types/types'
import { CircularProgress } from '@nextui-org/react'
import React from 'react'

export default function CardStyle6({infos} : {infos : SixthCardItemType}) {
  return (
    <div className='flex flex-col p-2 bg-white rounded-lg font-sans'>
        <section className='flex flex-row items-center justify-between'>
            <div className='flex items-center gap-1'>
                <CircularProgress
                    aria-label="Loading..."
                    size="md"
                    value={infos.availableValue}
                    color="success"
                    showValueLabel={true}
                    classNames={{
                        value : "text-lg font-bold",
                        svg : "h-16 w-16"
                    }}
                />
                <span className='text-base font-medium'>available</span>
            </div>
            <div className='flex items-center gap-1'>
                <CircularProgress
                    aria-label="Loading..."
                    size="md"
                    value={infos.categoriesValue}
                    color="primary"
                    showValueLabel={true}
                    classNames={{
                        value : "text-lg font-bold",
                        svg : "h-16 w-16"
                    }}
                />
                <span className='text-base font-medium'>categories</span>
            </div>
          
        </section>
        <section className='flex flex-col items-center justify-center gap-1'>
            <p className='text-xl font-semibold'>{infos.title}</p>
            <p className='text-3xl font-bold'>{infos.value}</p>
        </section>
        <section className='flex flex-row items-center justify-between'>
            <div className='flex items-center gap-1'>
                <CircularProgress
                    aria-label="Loading..."
                    size="md"
                    value={infos.notFoundValue}
                    color="danger"
                    showValueLabel={true}
                    classNames={{
                        value : "text-lg font-bold",
                        svg : "h-16 w-16"
                    }}
                />
                <span className='text-base font-medium'>not found</span>
            </div>
            <div className='flex items-center gap-1'>
                <CircularProgress
                    aria-label="Loading..."
                    size="md"
                    value={infos.thisDayValue}
                    color="secondary"
                    showValueLabel={true}
                    classNames={{
                        value : "text-lg font-bold",
                        svg : "h-16 w-16"
                    }}
                />
                <span className='text-base font-medium mr-4'>this day</span>
            </div>
        </section>
    </div>
  )
}
