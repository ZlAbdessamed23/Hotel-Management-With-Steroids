import AddBudgetModal from '@/app/main/components/modals/forms/AddBudgetModal';
import { OperationMode } from '@/app/types/constants';
import { Budget, BudgetModalProps } from '@/app/types/types';
import { Button, useDisclosure } from '@nextui-org/react';
import React from 'react'

export default function BudgetCmp({budget} : {budget : Budget}) {

    const OpenMdoal = useDisclosure();
    const budgetInfos : BudgetModalProps = {
        material : budget.material.amount,
        restaurant : budget.restau.amount,
        spa : budget.spa.amount,
    };

  return (
    <div className='w-[374px] rounded-xl shadow-sm p-4 bg-white dark:bg-slate-800 '>
        <section className='flex items-center justify-between p-2'>
            <p className='text-3xl font-semibold text-primary'>Editer le Budget</p>
            <Button size='md' variant='shadow' color='secondary' onClick={OpenMdoal.onOpen}>Editer</Button>
        </section>
        <section className='w-11/12 mx-auto'>
            {
                Object.entries(budget).map(([key, value] : [key : string , value : {id : string , amount : number}]) => (
                    <div key={key} className='flex items-center justify-between'>
                        <span className='text-xl font-semibold text-green-500'>{value.amount}</span>
                        <span className='text-xl font-medium'>{key}</span>
                    </div>
                ))
            }
        </section>
        <section>
            <AddBudgetModal props={OpenMdoal} initialData={budgetInfos} />
        </section>
    </div>
  )
}
