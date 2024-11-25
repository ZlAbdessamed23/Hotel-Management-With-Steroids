"use client"

import { EmployeeState } from '@/app/types/constants';
import { ModalProps, SelfUpdateEmployee } from '@/app/types/types'
import { updateSelfEmployee } from '@/app/utils/funcs';
import { Modal, ModalContent, ModalHeader, ModalBody, Select, SelectItem, ModalFooter, Button, Input } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function UpdateEmployeeModal({ props, initialData }: { props: ModalProps, initialData: SelfUpdateEmployee }) {

  const States = Object.values(EmployeeState);
  const router = useRouter();
  const { register, handleSubmit } = useForm<SelfUpdateEmployee>({
    defaultValues: {
      ...initialData, state: initialData.state?.split('_').join(' ') as EmployeeState, dateOfBirth: initialData.dateOfBirth ? new Date(initialData.dateOfBirth).toISOString().split('T')[0] : new Date()
    }
  });

  async function handleUpdate(data: SelfUpdateEmployee) {
    const message = await updateSelfEmployee(data);
    router.refresh();
    return message;
  };

  const onSubmit: SubmitHandler<SelfUpdateEmployee> = async (data) => {
    const result = handleUpdate(data);
    await toast.promise(result, {
      loading: 'Loading...',
      success: (data) => `${data}`,
      error: (err) => `${err.toString()}`,
    }
    );
  };

  return (
    <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange} className='font-segoe z-50' scrollBehavior="inside">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Ajouter un Employé</ModalHeader>
            <ModalBody>
              <form className='flex flex-col gap-1 items-start' >
                <Input variant='bordered' color='secondary' type='text' label="Nom" {...register('firstName')} />
                <Input variant='bordered' color='secondary' type='text' label="Prénom" {...register('lastName')} />
                <Input variant='bordered' color='secondary' type='text' label="Adresse" {...register('address')} />
                <Input variant='bordered' color='secondary' type='date' label="Date de naissance" {...register('dateOfBirth')} />
                <Input variant='bordered' color='secondary' type='text' label="Mot de Passse" {...register('password')} />
                <Input variant='bordered' color='secondary' type='text' label="Téléphone" {...register('phoneNumber')} />
                <Input variant='bordered' color='secondary' type='text' label="Nationalité" {...register('nationality')} />
                <Select color='secondary' label="Status" className="w-full" {...register('state')}>
                  {States.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </Select>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Fermer
              </Button>
              <Button color="primary" type="submit" onClick={handleSubmit(onSubmit)}>
                Sauvegarder
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>)
}
