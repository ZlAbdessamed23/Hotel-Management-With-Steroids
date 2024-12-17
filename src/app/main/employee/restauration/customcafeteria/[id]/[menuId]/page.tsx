"use client"
import CardStyle7 from '@/app/main/components/cards/CardStyle7'
import AddRestau_CafeteriaItemModal from '@/app/main/components/modals/forms/AddRestau_CafeteriaItemModal'
import { PageStructureType2, Restau_CafeteriaItem } from '@/app/types/types'
import React, { useState } from 'react'
import CafeteriaItemImage from "/public/CafeteriaItemImage.svg";
import CafeteriaMenuFacturePart1 from '@/app/main/components/other/CafeteriaMenuFacturePart1'
import CafeteriaMenuFacturePart2 from '@/app/main/components/other/CafeteriaMenuFacturePart2'
import { CafeteriaMenuProvider } from '@/app/main/components/CafeteriaMeniContext'
import { deleteCafeteriaMenu, getAllCafeteriaMenuItems } from '@/app/utils/funcs'
import { StaticImageData } from 'next/image'
import PagesStructure2 from '@/app/main/components/PageStructure2'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function RestauMenuPage({ params }: {
    params: { menuId: string, id: string }
}) {
    const router = useRouter();
    const [items, setItems] = React.useState<Restau_CafeteriaItem[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [fetchTrigger, setFetchTrigger] = useState(0);

    async function handleDeleteMenu() {
        try {
            const res = await deleteCafeteriaMenu(params.id , params.menuId);
            if (res) {
                setTimeout(() => {
                    router.push("/main/employee/restauration/customcafeteria");
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

    const fetchData = React.useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await getAllCafeteriaMenuItems(params.menuId);
            const fetchedItems = Object.values(response)[0] as Restau_CafeteriaItem[];
            if (Array.isArray(fetchedItems)) {
                setItems(fetchedItems);
                return response;
            } else {
                throw new Error('Fetched data is not an array');
            }
        } catch (err) {
            const errorMessage = 'Failed to fetch data: ' + (err instanceof Error ? err.message : String(err));
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [params.menuId]);

    const cafeteriaPageProps: PageStructureType2<Restau_CafeteriaItem> = {
        fetchFunc: fetchData,
        main: {
            buttonText: "Ajouter un objet pour le menu",
            mainComponent: CardStyle7,
            AddModal: AddRestau_CafeteriaItemModal,
        },
        deleteFunc: () => handleDelete()
    };

    React.useEffect(() => {
        fetchData();
    }, [fetchData, fetchTrigger]);

    return (
        <CafeteriaMenuProvider cafeteriaId={params.id} fetchTrigger={fetchTrigger} setFetchTrigger={setFetchTrigger} cafeteriaMenuId={params.menuId} fetchType='cafeteria'>
            <div>
                <section className='mb-12'>
                    <PagesStructure2 dataType='cafetriaItem' DisplayIcon={CafeteriaItemImage as StaticImageData} props={cafeteriaPageProps} />
                </section>
                {isLoading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <section className='flex flex-row gap-6 h-fit'>
                        <span className='w-1/2 bg-white rounded-sm shadow-sm p-2'>
                            <CafeteriaMenuFacturePart1 />
                        </span>
                        <span className='w-1/2'>
                            <CafeteriaMenuFacturePart2 items={items} />
                        </span>
                    </section>
                )}
            </div>
        </CafeteriaMenuProvider>
    )
}