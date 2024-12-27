"use client";

import { DiscoveredWay, OperationMode, ReservationSource, ReservationState, RoomState, RoomType } from '@/app/types/constants';
import { Client, ModalModeProps, Reservation } from '@/app/types/types';
import { addClientWithReservation, getRoom, updateClientWithReservation } from '@/app/utils/funcs';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRefreshMenuContext } from '../../RefreshTriggerContext';
import toast from 'react-hot-toast';

type ReservationModalProps = {
  props: ModalModeProps<Reservation>;
  client: Client;
};

const AddReservationModal: React.FC<ReservationModalProps> = ({ props, client }) => {
  const setRefreshTrigger = useRefreshMenuContext().setFetchTrigger;
  const RoomTypes = Object.values(RoomType);
  const ReservationSources = Object.values(ReservationSource);
  const DiscoveredWays = Object.values(DiscoveredWay);
  const ReservationStates = Object.values(ReservationState);
  const [gottenRoom, setGottenRoom] = useState<Reservation>();
  const { register, handleSubmit, reset } = useForm<Reservation>({
    defaultValues: {
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

  async function handleAddClientWithReservation(data: Reservation) {
    if (props.mode === OperationMode.add) {
      const response = await addClientWithReservation({
        client: client,
        reservation: data
      })
      setRefreshTrigger((prev) => prev + 1);
      return response;
    }
    else {
      const response = await updateClientWithReservation({
        client: client,
        reservation: data
      }, props.initialData?.clientId as string, props.initialData?.id as string);
      setRefreshTrigger((prev) => prev + 1);
      return response;
    }
  };


  const onSubmit: SubmitHandler<Reservation> = async (data) => {
    const result = handleAddClientWithReservation(data);
    await toast.promise(result, {
      loading: 'Loading...',
      success: (data) => `${data}`,
      error: (err) => `${err.toString()}`,
    }
    );
  };

  async function getRoomReservation() {
    console.log(client);
    if (client.reservations) {
      console.log("yeah");
      const data = await getRoom(client?.reservations[0].id as string);
      setGottenRoom(data.room);
    };
  };

  useEffect(() => {
  }, [client]);

  useEffect(() => {
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
      getRoomReservation();
      if (client.reservations && client.reservations.length > 0) {
        const data: Reservation = {
          roomNumber: gottenRoom?.roomNumber as string,
          roomType: gottenRoom?.roomType as RoomType,
          startDate: gottenRoom?.startDate as Date,
          endDate: gottenRoom?.endDate as Date,
          state: gottenRoom?.state as ReservationState,
          totalPrice: gottenRoom?.totalPrice as number,
          reservationSource: gottenRoom?.reservationSource as ReservationSource,
          source: gottenRoom?.source,
          discoverChannel: gottenRoom?.discoverChannel,
          clientId: client.id as string,
          totalDays: gottenRoom?.totalDays as number,
          id: client?.reservations[0].id as string,
        };
        reset(data);
      }
    };
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


export default AddReservationModal;