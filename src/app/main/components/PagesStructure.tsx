"use client"

import { Button, Input, useDisclosure } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { FaPlus, FaSearch } from 'react-icons/fa'
import { PageStructureType } from '@/app/types/types'
import { OperationMode } from '@/app/types/constants'
import { IconType } from 'react-icons'
import { StaticImageData } from 'next/image'

export default function PagesStructure<CardType extends { title: string }, FetchDataType>({
    props,
    url,
    Icon,
    transformData
}: {
    props: PageStructureType<CardType, FetchDataType>
    url: string
    Icon: StaticImageData | IconType
    transformData: (data: FetchDataType[]) => CardType[]
}) {
    const [data, setData] = useState<CardType[]>([])
    const [filteredData, setFilteredData] = useState<CardType[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')

    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await props.fetchFunc()
                const items = Object.values(response)[0] as FetchDataType[]
                const transformedItems = transformData(items)
                setData(transformedItems)
                setFilteredData(transformedItems)
            } catch (err) {
                setError('Failed to fetch data')
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [props.fetchFunc, transformData])

    const handleSearch = (value: string) => {
        setSearchTerm(value)
        if (value.trim() === '') {
            setFilteredData(data)
        } else {
            const filtered = data.filter((item) =>
                item.title.toLowerCase().includes(value.toLowerCase())
            )
            setFilteredData(filtered)
        }
    }

    return (
        <div className='text-white flex flex-col gap-10'>
            <section className='w-full h-64 p-6 grid grid-cols-[75%,25%] bg-gradient-to-r from-blue-900 to-blue-600 rounded-xl'>
                <div>
                    <h1 className='text-3xl lg:text-4xl xl:text-5xl font-medium mb-4'>{props.hero.title}</h1>
                    <p className='text-base md:text-xl font-medium w-2/3 md:pl-8 mb-2 md:w-fit'>{props.hero.description}</p>
                </div>
                <div>
                    <Image
                        src={props.hero.image}
                        alt=''
                        width={props.hero.imageDimensions.width}
                        height={props.hero.imageDimensions.height}
                    />
                </div>
            </section>
            <section className='flex flex-col gap-4 sm:gap-0 sm:flex-row sm:items-center sm:justify-between'>
                <div className='w-4/5'>
                    <Input
                        startContent={<FaSearch className='text-black' />}
                        classNames={{
                            inputWrapper: "border border-gray-500 dark:bg-slate-800"
                        }}
                        isClearable
                        className="sm:w-[10rem] w-full lg:w-[20rem]"
                        placeholder="La Recherche par Nom ..."
                        value={searchTerm}
                        onValueChange={handleSearch}
                    />
                </div>
                <div className='flex items-center gap-8'>
                    <Button className='bg-secondary text-white' endContent={<FaPlus className='size-5' />} onClick={onOpen}>
                        {props.main.buttonText}
                    </Button>
                    <props.main.AddModal isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange} mode={OperationMode.add} />
                </div>
            </section>
            <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                {isLoading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    filteredData.map((infos, index) => (
                        <props.main.mainComponent
                            key={index}
                            infos={infos}
                            url={url}
                            Icon={Icon}
                        />
                    ))
                )}
            </section>
        </div>
    )
}