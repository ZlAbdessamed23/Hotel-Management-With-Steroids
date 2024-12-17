"use client"

import CardStyle7 from '@/app/main/components/cards/CardStyle7'
import AddRestau_CafeteriaItemModal from '@/app/main/components/modals/forms/AddRestau_CafeteriaItemModal'
import { PageStructureType2, Restau_CafeteriaItem } from '@/app/types/types'
import { Tabs, Tab } from '@nextui-org/react'
import React, { useState } from 'react'
import RestauItemImage from "/public/RestauItemImage.svg";
import { deleteRestaurantMenu, getAllRestauMenuItems } from '@/app/utils/funcs'
import { CafeteriaMenuProvider } from '@/app/main/components/CafeteriaMeniContext'
import PagesStructure2 from '@/app/main/components/PageStructure2'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function RestauMenuPage({params} : {
    params : {menuId : string , id : string}
}) {
    const router = useRouter();
    const [fetchTrigger , setFetchTrigger] = useState(0);
    const fetchLunchData = React.useCallback(async () => {
        try {
            const response = await getAllRestauMenuItems(params.menuId);
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
    }, [params.menuId]);

    async function handleDeleteMenu() {
        try {
            const res = await deleteRestaurantMenu(params.id , params.menuId);
            if (res) {
                setTimeout(() => {
                    router.push("/main/employee/restauration/customrestaurant");
                }, 1000);
            }
            return res;
        }
        catch (err: any) {
            throw new Error(err);
        };
    };

    async function handleDelete() {
        const result = handleDeleteMenu();
        await toast.promise(result, {
            loading: 'Loading...',
            success: (data) => `${data}`,
            error: (err) => `${err.toString()}`,
        }
        );
    };


    const fetchDinnerData = React.useCallback(async () => {
        try {
            const response = await getAllRestauMenuItems(params.menuId);
            const fetchedItems = Object.values(response)[0] as Restau_CafeteriaItem[];
            if (Array.isArray(fetchedItems)) {
                const dinnerItems = fetchedItems.filter(item => item.mealType === 'dinner');
                return { dinnerItems };
            } else {
                throw new Error('Fetched data is not an array');
            }
        } catch (err) {
            throw err;
        };
    }, [params.menuId]);

    const lunchPageStructure: PageStructureType2<Restau_CafeteriaItem> = {
        fetchFunc: fetchLunchData,
        main: {
            buttonText: "Ajouter un objet pour le déjeuner",
            mainComponent: CardStyle7,
            AddModal: AddRestau_CafeteriaItemModal,
        },
        deleteFunc : () => handleDelete()
    };

    const dinnerPageStructure: PageStructureType2<Restau_CafeteriaItem> = {
        fetchFunc: fetchDinnerData,
        main: {
            buttonText: "Ajouter un objet pour le dîner",
            mainComponent: CardStyle7,
            AddModal: AddRestau_CafeteriaItemModal,
        },
        deleteFunc : () => handleDelete()
    };

    return (
        <CafeteriaMenuProvider cafeteriaId={params.id} fetchTrigger={fetchTrigger} setFetchTrigger={setFetchTrigger} cafeteriaMenuId={params.menuId} fetchType='restau'>
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