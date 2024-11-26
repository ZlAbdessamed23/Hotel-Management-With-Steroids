"use client"

import React, { ChangeEvent, useEffect, useState } from 'react';
import { FaSearch, FaPlus } from 'react-icons/fa';
import { RefreshMenuProvider } from '@/app/main/components/RefreshTriggerContext';
import { OperationMode } from '@/app/types/constants';
import { Stock } from '@/app/types/types';
import { Button, Input, useDisclosure } from '@nextui-org/react';
import CardStyle8 from '@/app/main/components/cards/CardStyle8';
import { getAllRestaurants } from '@/app/utils/funcs';
import CafeteriaItemImage from "/public/CafeteriaItemImage.svg";
import AddRestaurantModal from '@/app/main/components/modals/forms/AddRestaurantModal';


export default function CustomRestaurant() {
    const [restaurants, setRestaurants] = useState<Stock[]>([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState<Stock[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const AddStock = useDisclosure();
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

    function handleSearchChange(event: ChangeEvent<HTMLInputElement>): void {
        const term = event.target.value;
        setSearchTerm(term);
        if (term === "") {
            setFilteredRestaurants(restaurants);
        } else {
            setFilteredRestaurants(restaurants.filter(stock => stock.name.toLowerCase().includes(term.toLowerCase())));
        };
    };

    function clearSearch(): void {
        setSearchTerm("");
        setFilteredRestaurants(restaurants);
    };

    async function getrestaurants() {
        const data = await getAllRestaurants();
        setRestaurants(data.Restaurants);
        setFilteredRestaurants(data.Restaurants);
    };

    useEffect(() => {
        getrestaurants();
    }, [refreshTrigger]);

    return (
        <div>
            <section className='relative w-full h-64 p-6 grid grid-cols-[75%,25%] bg-gradient-to-r from-blue-900 to-blue-600 rounded-xl mb-10'>
                <div>
                    <h1 className='text-3xl lg:text-4xl xl:text-5xl font-medium mb-4'>Gestion de Restaurant Personnalisé</h1>
                    <p className='text-base md:text-xl font-medium w-2/3 md:pl-8 mb-2 md:w-fit'>Configurez et gérez les éléments de votre restaurant, y compris les menus et les catégories pour une expérience sur mesure.</p>
                </div>
            </section>
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
                    <Button className='bg-secondary text-white' endContent={<FaPlus className='size-5' />} onClick={AddStock.onOpen}>Ajouter un nouvel Restaurant</Button>
                    <RefreshMenuProvider setFetchTrigger={setRefreshTrigger}>
                        <AddRestaurantModal isOpen={AddStock.isOpen} onOpen={AddStock.onOpen} onOpenChange={AddStock.onOpenChange} mode={OperationMode.add} />
                    </RefreshMenuProvider>
                </div>
            </section>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRestaurants.map((restaurant) => <CardStyle8 key={restaurant.id} Icon={CafeteriaItemImage} infos={{ id: restaurant.id || "", date: restaurant.createdAt || new Date(), description: restaurant.description, title: restaurant.name }} url={`/main/employee/restauration/customrestaurant`} />)}
            </div>
        </div>
    );
}
