import { BudgetModalProps, ModalProps } from '@/app/types/types'
import { editBudget } from '@/app/utils/funcs';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function AddBudgetModal({ props, initialData }: { props: ModalProps, initialData: BudgetModalProps }) {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<BudgetModalProps>({
    defaultValues: initialData || {
      material: 0,
      restaurant: 0,
      spa: 0,
    },
  });

  async function handleAdd(data : BudgetModalProps) {
    const message = await editBudget(data)
    router.refresh();
    return message;
  };

  const onSubmit: SubmitHandler<BudgetModalProps> = async (data) => {
    const result = handleAdd(data);
    await toast.promise(result, {
      loading: 'Loading...',
      success: (data) => `${data}`,
      error: (err) => `${err.toString()}`,
    })
  };

  useEffect(() => {
    reset(initialData);
  },[initialData]);

  return (
    <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange} className='font-segoe'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Editer le Budget</ModalHeader>
            <ModalBody>
              <form className='flex flex-col gap-1 items-start' onSubmit={handleSubmit(onSubmit)}>
                <Input
                  variant='bordered'
                  color='secondary'
                  type='number'
                  {...register('material')}
                  label="material"
                />
                <Input
                  variant='bordered'
                  color='secondary'
                  type='number'
                  {...register('restaurant')}
                  label="restau"
                />
                <Input
                  variant='bordered'
                  color='secondary'
                  type='number'
                  {...register('spa')}
                  label="spa"
                />
              </form>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Fermer
              </Button>
              <Button color="primary" variant='shadow' onClick={handleSubmit(onSubmit)}>
                Sauvegarder
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>)
};

