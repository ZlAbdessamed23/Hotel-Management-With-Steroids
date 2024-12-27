import AddBudgetModal from '@/app/main/components/modals/forms/AddBudgetModal';
import { Button, useDisclosure } from '@nextui-org/react';
import React from 'react';
import { StockBudget } from '@/app/types/types';

export default function BudgetCmp({ budgets }: { budgets: StockBudget[] }) {
  const modalControl = useDisclosure();

  return (
    <div className='w-[374px] rounded-xl shadow-sm p-4 bg-white dark:bg-slate-800 '>
      <section className='flex items-center justify-between p-2 mb-4'>
        <p className='text-2xl font-semibold text-primary'>Editer les Budgets</p>
        <Button size='md' variant='shadow' color='secondary' onClick={modalControl.onOpen}>
          Editer
        </Button>
      </section>
      <section className='w-11/12 mx-auto'>
        {budgets.map((budget) => (
          <div key={budget.stockId} className='flex items-center justify-between'>
            <span className='text-xl font-semibold text-green-500'>{budget.amount}</span>
            <span className='text-xl font-medium'>{budget.stockName}</span>
          </div>
        ))}
      </section>
      {modalControl.isOpen && (
        <section>
          <AddBudgetModal
            props={modalControl}
            initialData={budgets}
          />
        </section>
      )}
    </div>
  );
}
