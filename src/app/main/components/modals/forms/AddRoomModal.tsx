"use client";

import { ModalModeProps, Room } from '@/app/types/types';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Textarea } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { OperationMode, RoomState, RoomType } from '@/app/types/constants';
import { addRoom, updateRoom } from '@/app/utils/funcs';
import { useRefreshMenuContext } from '../../RefreshTriggerContext';
import toast from 'react-hot-toast';

const AddRoomModal: React.FC<ModalModeProps<Room>> = (props) => {
  const setRefreshTrigger = useRefreshMenuContext().setFetchTrigger;
  const States = Object.values(RoomState);
  const Types = Object.values(RoomType);
  const [isDescShown, setIsDescShown] = useState(false);

  const { register, handleSubmit, reset, watch , setValue } = useForm<Room>({
    defaultValues: props.initialData || {
      number: "",
      type: RoomType.single,
      price: "",
      status: RoomState.free,
      floorNumber: "",
      description: "",
      outOfServiceDescription: "",
    }
  });


  useEffect(() => {
    if (props.mode === OperationMode.update) {
      reset(props.initialData);
      setValue("status", props.initialData?.status.split("_").join(" ") as RoomState);
    }
    else {
      reset({
        number: "",
        type: RoomType.single,
        price: "",
        status: RoomState.free,
        floorNumber: "",
        description: "",
        outOfServiceDescription: "",
      });
    };
  }, [props.initialData, reset]);


  async function handleAddRoom(data: Room) {
    if (props.mode === OperationMode.add) {
      const response = await addRoom(data);
      setRefreshTrigger((prev) => prev + 1);
      return response;
    }
    else {
      const response = await updateRoom(props.initialData?.id as string, data);
      setRefreshTrigger((prev) => prev + 1);
      return response;
    };
  };

  
  const onSubmit = async (data: Room) => {
    const result = handleAddRoom(data);
    await toast.promise(result, {
      loading: 'Loading...',
      success: (data) => `${data}`,
      error: (err) => `${err.toString()}`,
    }
    );
  };

  const roomState = watch("status");

  useEffect(() => {
    if (roomState === RoomState.free || roomState === RoomState.reserved) {
      setIsDescShown(false);
    }
    else {
      setIsDescShown(true);
    };
  }, [roomState]);

  return (
    <div>
      <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange} className='font-segoe'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{props.mode === OperationMode.add ? "Ajouter" : "Editer"} une Chambre</ModalHeader>
              <ModalBody>
                <form className='flex flex-col gap-1 items-start' >
                  <Input variant='bordered' color='secondary' type='text' label="Le Numéro de la chambre" {...register('number')} />
                  <Input variant='bordered' color='secondary' type='text' label="Le Numéro de l'étage" {...register('floorNumber')} />
                  <Input variant='bordered' color='secondary' type='text' label="Le Prix" {...register('price')} />
                  <Select color='secondary' label="Le type de la chambre" className="w-full" {...register('type')}>
                    {Types.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select color='secondary' label="L'état de la chambre" className="w-full" {...register('status')}>
                    {States.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </Select>
                  {isDescShown && <Textarea color='secondary' label="Cause d'etre en panne" placeholder="Entrez votre description" className="w-full" {...register('outOfServiceDescription')} />}
                  <Textarea color='secondary' label="Description" placeholder="Entrer la description du chambre" className="w-full" {...register('description')} />
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


export default AddRoomModal;