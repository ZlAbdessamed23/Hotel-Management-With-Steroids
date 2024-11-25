import DisplayModalStyle2 from '@/app/main/components/modals/display/DisplayModalStyle2';
import { SuppliersDataType } from '@/app/types/types'
import { Button, useDisclosure } from '@nextui-org/react'
import React, { useState } from 'react'

export default function Suppliers({data} : {data : SuppliersDataType[]}) {
    const DisplayModal = useDisclosure();
    const [displayItem , setDisplayItem] = useState<SuppliersDataType>();

    function handleDisplaySupplier(supplier : SuppliersDataType) {
        setDisplayItem(supplier);
        DisplayModal.onOpen();
    };

  return (
    <div className='font-sans bg-white rounded-xl shadow-sm p-4 w-[374px] dark:bg-slate-800'>
        <h2 className='text-3xl font-semibold text-primarya text-center'>Les Fournisseurs</h2>
        <section className='flex flex-col gap-4'>
            {
                data.map((supplier) => (
                    <span key={supplier.supplierEmail} className='flex items-center justify-between'>
                        <p className='text-lg font-medium'>{supplier.supplierName}</p>
                        <Button variant='solid' color='success' onClick={() => handleDisplaySupplier(supplier)} >Voire</Button>
                    </span>
                ))
            }
        </section>
        <DisplayModalStyle2 props={DisplayModal} title1='Fournisseur' data1={displayItem as SuppliersDataType}  />
    </div>
  )
}
