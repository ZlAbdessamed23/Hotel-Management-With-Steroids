"use client"

import CardStyle7 from '@/app/main/components/cards/CardStyle7'
import AddRestau_CafeteriaItemModal from '@/app/main/components/modals/forms/AddRestau_CafeteriaItemModal'
import { PageStructureType2, Restau_CafeteriaItem } from '@/app/types/types'
import { Tabs, Tab } from '@nextui-org/react'
import React, { useState } from 'react'
import PagesStructure2 from '../components/PageStructure2'
import RestauItemImage from "/public/RestauItemImage.svg";
import { getAllRestauMenuItems } from '@/app/utils/funcs'
import { CafeteriaMenuProvider } from '@/app/main/components/CafeteriaMeniContext'

export default function RestauMenuPage({params} : {
    params : {id : string}
}) {
    const [fetchTrigger , setFetchTrigger] = useState(0);

    const fetchLunchData = React.useCallback(async () => {
        try {
            const response = await getAllRestauMenuItems(params.id);
            const fetchedItems = Object.values(response)[0] as Restau_CafeteriaItem[];
            if (Array.isArray(fetchedItems)) {
                const lunchItems = fetchedItems.filter(item => item.mealType === 'lunch');
                return { lunchItems };
            } else {
                throw new Error('Fetched data is not an array');
            }
        } catch (err) {
            throw err;
        };
    }, [params.id]);

    const fetchDinnerData = React.useCallback(async () => {
        try {
            const response = await getAllRestauMenuItems(params.id);
            const fetchedItems = Object.values(response)[0] as Restau_CafeteriaItem[];
            if (Array.isArray(fetchedItems)) {
                const dinnerItems = fetchedItems.filter(item => item.mealType === 'dinner');
                return { dinnerItems };
            } else {
                throw new Error('Fetched data is not an array');
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    }, [params.id]);

    const lunchPageStructure: PageStructureType2<Restau_CafeteriaItem> = {
        fetchFunc: fetchLunchData,
        main: {
            buttonText: "Ajouter un objet pour le déjeuner",
            mainComponent: CardStyle7,
            AddModal: AddRestau_CafeteriaItemModal,
        },
    };

    const dinnerPageStructure: PageStructureType2<Restau_CafeteriaItem> = {
        fetchFunc: fetchDinnerData,
        main: {
            buttonText: "Ajouter un objet pour le dîner",
            mainComponent: CardStyle7,
            AddModal: AddRestau_CafeteriaItemModal,
        },
    };

    return (
        <CafeteriaMenuProvider fetchTrigger={fetchTrigger} setFetchTrigger={setFetchTrigger} cafeteriaMenuId={params.id} fetchType='restau'>
            <div>
                <section>
                    <Tabs aria-label="Options" className='w-full' classNames={{
                        base : "w-full",
                        tabList: "w-full flex flex-row items-center justify-between",
                        tab : "w-[20rem]",       
                        }}>
                        <Tab key="Launch" title="Déjeuné">
                            <PagesStructure2 dataType='restauItem' DisplayIcon={RestauItemImage} props={lunchPageStructure} />
                        </Tab>
                        <Tab key="Dinner" title="Dîner">
                            <PagesStructure2 dataType='restauItem' DisplayIcon={RestauItemImage} props={dinnerPageStructure} />
                        </Tab>  
                    </Tabs>
                </section>
            </div>
        </CafeteriaMenuProvider>
    )
}