import { EventType } from '@/app/types/constants';
import { Event, ModalModeProps } from '@/app/types/types';
import { addEvent, updateEvent } from '@/app/utils/funcs';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Textarea } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { OperationMode } from '@/app/types/constants';

const AddEventModal: React.FC<ModalModeProps<Event>> = (props) => {
  const Types = Object.values(EventType);
  const router = useRouter();

  const { register, handleSubmit, watch, reset } = useForm<Event>({
    defaultValues: {
      name: "",
      leader: "",
      description: "",
      startDate: "",
      endDate: "",
      guests: 0,
      isGuestNumberKnown: props.initialData?.isGuestNumberKnown || "non",
      bankCard: "",
      eventType: EventType.anniversaire,
    }
  });

  const isGuestNumberKnown = watch("isGuestNumberKnown");
  const [isInputShown, setIsInputShown] = useState<boolean>(false);

  async function handleAddEvent(data: Event) {
    if (props.mode === OperationMode.add) {
      const response = await addEvent(data);
      router.refresh();
      return response;
    }
    else {
      const response = await updateEvent(data, props.initialData?.id as string);
      router.refresh();
      return response;
    }
  };

  const onSubmit: SubmitHandler<Event> = async (data) => {
    const result = handleAddEvent(data);
    await toast.promise(result, {
      loading: 'Loading...',
      success: (data) => `${data}`,
      error: (err) => `${err.toString()}`,
    });
  };

  useEffect(() => {
    if (isGuestNumberKnown === "oui") {
      setIsInputShown(true);
    }
    else {
      setIsInputShown(false);
    };
  }, [isGuestNumberKnown]);

  useEffect(() => {
    if (props.mode === OperationMode.add) {
      reset({
        name: "",
        leader: "",
        description: "",
        startDate: "",
        endDate: "",
        guests: 0,
        isGuestNumberKnown: "non",
        bankCard: "",
        eventType: EventType.anniversaire,
      })
    }
    else {
      if (props.initialData) {
        console.log(props.initialData);
        const data: Event | undefined = props.initialData ? {
          ...props.initialData, startDate: props.initialData.startDate ? new Date(props.initialData.startDate).toISOString().split('T')[0] : new Date(), endDate: props.initialData.endDate ? new Date(props.initialData.endDate).toISOString().split('T')[0] : new Date(), isGuestNumberKnown: props.initialData.guests === 0 ? "non" : "oui"
        } : undefined;
        reset(data);
      }
    };
  }, [props.initialData]);

  return (
    <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange} className='font-segoe'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {props.mode === OperationMode.add ? "Ajouter" : "Editer"} un Evennement
            </ModalHeader>
            <ModalBody>
              <form className='flex flex-col gap-1 items-start'>
                <Input variant='bordered' color='secondary' type='text' label="Nom" {...register('name')} />
                <Input variant='bordered' color='secondary' type='text' label="D'après" {...register('leader')} />
                <Input variant='bordered' color='secondary' type='date' label="Commence en" {...register('startDate')} />
                <Input variant='bordered' color='secondary' type='date' label="Se termine en" {...register('endDate')} />
                <Select color='secondary' label="Saviez-vous le nombre des invités?" className="w-full" {...register('isGuestNumberKnown')}>
                  <SelectItem key={"oui"} value={"oui"}>Oui</SelectItem>
                  <SelectItem key={"non"} value={"non"}>Non</SelectItem>
                </Select>
                <Select color='secondary' label="tye de l'évenement" className="w-full" {...register('eventType')}>
                  {Types.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </Select>
                {isInputShown && (
                  <Input variant='bordered' color='secondary' type='text' label="Nombre d'Invités" {...register('guests')} />
                )}
                <Textarea color='secondary' label="Description" placeholder="Enter your description" className="w-full" {...register('description')} />
                <Input variant='bordered' color='secondary' type='text' label="Numéro du carte bankaire" {...register('bankCard')} />
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
  );
}

export default AddEventModal;