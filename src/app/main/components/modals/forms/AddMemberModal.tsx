"use client"

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from '@nextui-org/react';
import { Client, ModalProps } from '@/app/types/types';
import { UserGender } from '@/app/types/constants';
import { addMember } from '@/app/utils/funcs';
import { useRefreshMenuContext } from '../../RefreshTriggerContext';
import toast from 'react-hot-toast';

export default function AddMemberModal({ props, resId }: { props: ModalProps, resId: string }) {
  const setRefreshTrigger = useRefreshMenuContext().setFetchTrigger;
  const Genders = Object.values(UserGender);
  const { register, handleSubmit } = useForm<Client>({
    defaultValues: {
      fullName: "",
      address: "",
      dateOfBirth: "",
      gender: UserGender.male,
      identityCardNumber: "",
      phoneNumber: "",
      email: "",
      nationality: "",
    },
  });

  async function handleAddMember(data: Client) {
    const response = await addMember(data, resId);
    setRefreshTrigger((prev) => prev + 1);
    return response;
  };

  const onSubmit: SubmitHandler<Client> = async (data) => {
    const result = handleAddMember(data);
    await toast.promise(result, {
      loading: 'Loading...',
      success: (data) => `${data}`,
      error: (err) => `${err.toString()}`,
    }
    );
  };

  return (
    <div>
      <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange} className='font-segoe'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Ajouter un Client</ModalHeader>
              <ModalBody>
                <form className='flex flex-col gap-1 items-start' onSubmit={handleSubmit(onSubmit)}>
                  <Input
                    variant='bordered'
                    color='secondary'
                    type='text'
                    {...register('fullName')}
                    label="nom complet"
                  />
                  <Input
                    variant='bordered'
                    color='secondary'
                    type='text'
                    {...register('address')}
                    label="addresse"
                  />
                  <Input
                    variant='bordered'
                    color='secondary'
                    type='date'
                    {...register('dateOfBirth')}
                    label="date de naissance"
                  />
                  <Input
                    variant='bordered'
                    color='secondary'
                    type='text'
                    {...register('identityCardNumber')}
                    label="numéro du carte nationale"
                  />
                  <Input
                    variant='bordered'
                    color='secondary'
                    type='text'
                    {...register('email')}
                    label="email"
                  />
                  <Input
                    variant='bordered'
                    color='secondary'
                    type='text'
                    {...register('phoneNumber')}
                    label="téléphone"
                  />
                  <Input
                    variant='bordered'
                    color='secondary'
                    type='text'
                    {...register('nationality')}
                    label="nationalité"
                  />
                  <Select color='secondary' label="Sexe" className="w-full" {...register('gender')}>
                    {Genders.map((gender) => (
                      <SelectItem key={gender} value={gender}>
                        {gender}
                      </SelectItem>
                    ))}
                  </Select>
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
      </Modal>
    </div>
  )
}

