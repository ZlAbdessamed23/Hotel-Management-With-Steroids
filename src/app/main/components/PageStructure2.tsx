"use client"

import { Button, Input, useDisclosure } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { StaticImageData } from 'next/image'
import { FaPlus, FaSearch } from 'react-icons/fa'
import { PageStructureType2, Restau_CafeteriaItem } from '@/app/types/types'
import { OperationMode } from '@/app/types/constants'
import DisplayModalStyle3 from '@/app/main/components/modals/display/DisplayModalStyle3'
import AddRestau_CafeteriaItemModal from '@/app/main/components/modals/forms/AddRestau_CafeteriaItemModal'
import { useCafeteriaMenuContext } from '@/app/main/components/CafeteriaMeniContext'
import { MdDelete } from 'react-icons/md'

export default function PagesStructure2({ props, DisplayIcon, dataType }: { props: PageStructureType2<Restau_CafeteriaItem>, DisplayIcon: StaticImageData, dataType: "restauItem" | "cafetriaItem" }) {
    const [data, setData] = useState<Restau_CafeteriaItem[]>([]);
    const [filteredData, setFilteredData] = useState<Restau_CafeteriaItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [displayedItem, setDisplayedItem] = useState<Restau_CafeteriaItem>();
    const DisplayModalProps = useDisclosure();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { fetchTrigger } = useCafeteriaMenuContext();

    async function fetchData() {
        try {
            const response = await props.fetchFunc();
            const items = Object.values(response)[0] as Restau_CafeteriaItem[];
            if (Array.isArray(items)) {
                setData(items);
                setFilteredData(items);
            } else {
                throw new Error('Fetched data is not an array');
            }
        } catch (err) {
            setError('Failed to fetch data: ' + (err instanceof Error ? err.message : String(err)));
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, [props.fetchFunc, fetchTrigger]);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        if (value.trim() === '') {
            setFilteredData(data);
        } else {
            const filtered = data.filter(item =>
                item.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredData(filtered);
        };
    };

    return (
        <div className='text-white flex flex-col gap-10'>
            <div className='flex flex-col gap-4'>
                <div className='flex items-center justify-end w-[97%]'>
                    <Button startContent={<MdDelete className='size-5' />} color='danger' onClick={props.deleteFunc}>Supprimer le menu</Button>
                </div>
                <section className='flex flex-col gap-4 sm:gap-0 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='w-4/5'>
                        <Input
                            startContent={<FaSearch className='text-black' />}
                            classNames={{
                                inputWrapper: "border border-gray-500 dark:bg-slate-800"
                            }}
                            isClearable
                            className="sm:w-[10rem] w-full lg:w-[20rem] "
                            placeholder="La Recherche par Nom ..."
                            value={searchTerm}
                            onValueChange={handleSearch}
                        />
                    </div>
                    <div className='flex items-center gap-8'>
                        <Button className='bg-secondary text-white' endContent={<FaPlus className='size-5' />} onClick={onOpen}>{props.main.buttonText}</Button>
                        <props.main.AddModal isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange} mode={OperationMode.add} />
                        {
                            displayedItem && <DisplayModalStyle3<Restau_CafeteriaItem> title1='Voire' data1={displayedItem} props={DisplayModalProps} SecondModal={AddRestau_CafeteriaItemModal} dataType={dataType} />
                        }
                    </div>
                </section>
            </div>
            <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 zl:grid-cols-4 gap-4'>
                {isLoading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : filteredData.length > 0 ? (
                    filteredData.map((infos, index) => (
                        <props.main.mainComponent key={index} infos={infos} DipslayIcon={DisplayIcon} onOpen={DisplayModalProps.onOpen} setDisplayedItem={setDisplayedItem} />
                    ))
                ) : (
                    <p>No items found</p>
                )}
            </section>
        </div>
    )
}