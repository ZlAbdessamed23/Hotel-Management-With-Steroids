"use client"

import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from '@nextui-org/react';
import { Client, ModalModeProps, Reservation } from '@/app/types/types';
import { ClientOrigin, OperationMode, UserGender } from '@/app/types/constants';
import { addClient, updateClient } from '@/app/utils/funcs';
import AddReservationModal from './AddReservationModal';
import { useRefreshMenuContext } from '../../RefreshTriggerContext';
import toast from 'react-hot-toast';

const AddClientModal: React.FC<ModalModeProps<Client>> = (props) => {

  const setRefreshTrigger = useRefreshMenuContext().setFetchTrigger;
  const Genders = Object.values(UserGender);
  const Origins = Object.values(ClientOrigin);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [reservation, setReservation] = useState<Reservation>();

  const secondModalProps: ModalModeProps<Reservation> = {
    isOpen: isOpen,
    onOpen: onOpen,
    onOpenChange: onOpenChange,
    mode: props.mode,
    initialData: reservation
  };
  const { register, handleSubmit, reset, watch } = useForm<Client>({
    defaultValues: props.initialData || {
      fullName: "",
      address: "",
      dateOfBirth: "",
      identityCardNumber: "",
      membersNumber: 0,
      kidsNumber: 0,
      phoneNumber: "",
      email: "",
      nationality: "",
      gender: UserGender.male,
      clientOrigin: ClientOrigin.local,
    },
  });

  useEffect(() => {
    if (props.mode === OperationMode.update) {
      reset({ ...props.initialData, dateOfBirth: props.initialData?.dateOfBirth ? new Date(props.initialData.dateOfBirth).toISOString().split('T')[0] : "" });
    }
    else {
      reset({
        fullName: "",
        address: "",
        dateOfBirth: "",
        gender: "",
        identityCardNumber: "",
        membersNumber: 0,
        kidsNumber: 0,
        phoneNumber: "",
        email: "",
        nationality: "",
        clientOrigin: ClientOrigin.local,
      });
    };
  }, [props.initialData, reset]);

  const client = watch();

  async function handleAddClient(client: Client) {
    if (props.mode === OperationMode.add) {
      const response = await addClient(client);
      setRefreshTrigger((prev) => prev + 1);
      return response;
    }
    else {
      const response = await updateClient(props.initialData?.id as string, client);
      setRefreshTrigger((prev) => prev + 1);
      return response;
    };
  };


  const onSubmit: SubmitHandler<Client> = async (data) => {
    const result = handleAddClient(data);
    await toast.promise(result, {
      loading: 'Loading...',
      success: (data) => `${data}`,
      error: (err) => `${err.toString()}`,
    }
    );
  }

  function passToSecondModal(onClose: () => void) {
    onOpen();
  };

  useEffect(() => {
    console.log(client);
  }, [client]);

  return (
    <div>
      <Modal scrollBehavior='inside' isOpen={props.isOpen} onOpenChange={props.onOpenChange} className='font-segoe'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{props.mode === OperationMode.add ? "Ajouter" : "Editer"} un Client</ModalHeader>
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
                    type='number'
                    {...register('membersNumber')}
                    label="nombre des membres"
                  />
                  <Input
                    variant='bordered'
                    color='secondary'
                    type='number'
                    {...register('kidsNumber')}
                    label="nombre d'enfants"
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

                  <Select color='secondary' label="étranger ou local ?" className="w-full" {...register('clientOrigin')}>
                    {Origins.map((origin) => (
                      <SelectItem key={origin} value={origin}>
                        {origin}
                      </SelectItem>
                    ))}
                  </Select>
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Fermer
                </Button>
                <Button color="secondary" variant="shadow" onClick={() => passToSecondModal(onClose)}>
                  Chambre
                </Button>
                <Button color="primary" variant='shadow' onClick={handleSubmit(onSubmit)}>
                  Sauvegarder
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <AddReservationModal client={client} props={secondModalProps} />
    </div>
  )
}

export default AddClientModal;
