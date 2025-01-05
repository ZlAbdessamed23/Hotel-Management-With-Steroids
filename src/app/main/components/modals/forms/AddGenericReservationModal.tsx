"use client";

import { DiscoveredWay, OperationMode, ReservationSource, ReservationState, RoomType } from '@/app/types/constants';
import { Client, ModalModeProps, Reservation } from '@/app/types/types';
import { addEventGuestReservation, addReservation, updateEventGuestReservation, updateReservation } from '@/app/utils/funcs';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

type ReservationModalProps = {
  props: ModalModeProps<Reservation>;
  client: Client | undefined;
  type: "client" | "eventInvited" | "eventWorker";
};

const AddGenericReservationModal: React.FC<ReservationModalProps> = ({ props, client, type }) => {
  const router = useRouter();
  const RoomTypes = Object.values(RoomType);
  const ReservationSources = Object.values(ReservationSource);
  const DiscoveredWays = Object.values(DiscoveredWay);
  const ReservationStates = Object.values(ReservationState);

  const { register, handleSubmit, reset } = useForm<Reservation>({
    defaultValues: props.initialData || {
      roomNumber: "",
      roomType: RoomType.single,
      startDate: "",
      endDate: "",
      totalDays: 0,
      totalPrice: 0,
      state: ReservationState.enAttente,
      source: ReservationSource.alone,
      discoverChannel: DiscoveredWay.facebook,
    }
  });

  async function handleAddReservation(data: Reservation) {
    if (props.mode === OperationMode.add) {
      if (type === 'client') {
        const response = await addReservation(client?.id as string, data);
        router.push("/main/employee/reception/manageclients");
        return response;
      }
      else {
        const response = await addEventGuestReservation(client?.id as string, client?.eventId as string, data);
        router.push(`/main/employee/reception/manageevents/${client?.eventId}`);
        return response;
      };
    }
    else {
      if (type === 'client') {
        const response = await updateReservation(client?.id as string, data, props.initialData?.id as string);
        router.push("/main/employee/reception/manageclients");
        return response;
      }
      else {
        const response = await updateEventGuestReservation(client?.id as string, client?.eventId as string, props.initialData?.id as string, data);
        router.push(`/main/employee/reception/manageevents/${client?.eventId}`);
        return response;
      };
    };
  }

  const onSubmit: SubmitHandler<Reservation> = async (data) => {
    const result = handleAddReservation(data);
    await toast.promise(result, {
      loading: 'Loading...',
      success: (data) => `${data}`,
      error: (err) => `${err.toString()}`,
    }
    );
  };

  useEffect(() => {
    console.log(client);
    if (props.mode === OperationMode.add) {
      reset({
        roomNumber: "",
        roomType: RoomType.single,
        startDate: "",
        endDate: "",
        totalDays: 0,
        totalPrice: 0,
        state: ReservationState.enAttente,
        source: ReservationSource.alone,
        discoverChannel: DiscoveredWay.facebook,
      });
    }
    else {
      reset(props.initialData);
    }
  }, [props.mode, props.initialData]);

  useEffect(() => {
    console.log(client);
  }, [client]);

  return (
    <div>
      <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange} className='font-segoe'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Reservation</ModalHeader>
              <ModalBody>
                <form className='flex flex-col gap-1 items-start' >
                  <Select color='secondary' label="Choisir le type de la chambre" className="w-full" {...register('roomType')}>
                    {RoomTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input variant='bordered' color='secondary' type='text' label="Nombre de la chambre" {...register('roomNumber')} />
                  <Select color='secondary' label="D'où vient le client?" className="w-full" {...register('source')}>
                    {ReservationSources.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select color='secondary' label="comment il a connait cet hotel??" className="w-full" {...register('discoverChannel')}>
                    {DiscoveredWays.map((way) => (
                      <SelectItem key={way} value={way}>
                        {way}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select color='secondary' label="status de réservation" className="w-full" {...register('state')}>
                    {ReservationStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input variant='bordered' color='secondary' type='date' label="Date d'entrée" {...register('startDate')} />
                  <Input variant='bordered' color='secondary' type='date' label="Date de sortie" {...register('endDate')} />
                  <Input variant='bordered' color='secondary' type='number' label="Prix" {...register('totalPrice')} />

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
      </Modal>
    </div>
  );
}


export default AddGenericReservationModal;