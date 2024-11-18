"use client"

import React, { ChangeEvent, useEffect, useState } from 'react';
import { FaSearch, FaPlus } from 'react-icons/fa';
import { RefreshMenuProvider } from '@/app/main/components/RefreshTriggerContext';
import AddStockModal from '@/app/main/components/modals/forms/AddStockModal';
import { OperationMode } from '@/app/types/constants';
import { Stock } from '@/app/types/types';
import { Button, Input, useDisclosure } from '@nextui-org/react';
import CardStyle8 from '@/app/main/components/cards/CardStyle8';
import { getAllStocks } from '@/app/utils/funcs';
import CafeteriaItemImage from "/public/CafeteriaItemImage.svg";


export default function CustomStock() {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const AddStock = useDisclosure();
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

    function handleSearchChange(event: ChangeEvent<HTMLInputElement>): void {
        const term = event.target.value;
        setSearchTerm(term);
        if (term === "") {
            setFilteredStocks(stocks);
        } else {
            setFilteredStocks(stocks.filter(stock => stock.name.toLowerCase().includes(term.toLowerCase())));
        };
    };

    function clearSearch(): void {
        setSearchTerm("");
        setFilteredStocks(stocks);
    };

    async function getStocks() {
        const data = await getAllStocks();
        console.log(data);
        setStocks(data.Stocks);
        setFilteredStocks(data.Stocks);
    };

    useEffect(() => {
        getStocks();
    }, [refreshTrigger]);

    return (
        <div>
            <section className='flex flex-col gap-4 sm:gap-0 sm:flex-row sm:items-center sm:justify-between'>
                <div className=''>
                    <Input
                        startContent={<FaSearch className='text-black' onClick={() => setSearchTerm("")} />}
                        classNames={{
                            inputWrapper: "border border-gray-500 text-black dark:bg-slate-800"
                        }}
                        isClearable
                        className="sm:w-[10rem] w-full lg:w-[20rem]"
                        placeholder="La Recherche par Nom ..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onClear={clearSearch}
                    />
                </div>
                <div className='flex items-center gap-8'>
                    <Button className='bg-secondary text-white' endContent={<FaPlus className='size-5' />} onClick={AddStock.onOpen}>Ajouter un nouvel Stock</Button>
                    <RefreshMenuProvider setFetchTrigger={setRefreshTrigger}>
                        <AddStockModal isOpen={AddStock.isOpen} onOpen={AddStock.onOpen} onOpenChange={AddStock.onOpenChange} mode={OperationMode.add} />
                    </RefreshMenuProvider>
                </div>
            </section>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStocks.map((stock) => <CardStyle8 key={stock.id} Icon={CafeteriaItemImage} infos={{ id: stock.id || "", date: stock.createdAt || new Date(), description: stock.description, title: stock.name }} url={`/main/employee/managestock/customstock`} />)}
            </div>
        </div>
    );
}
