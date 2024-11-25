import { EventStage, ModalProps } from '@/app/types/types';
import { addCalendarEventStage, addEventStage } from '@/app/utils/funcs';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, DateInput } from '@nextui-org/react';
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { parseZonedDateTime, now , toZoned , getLocalTimeZone } from "@internationalized/date";
import { useEventContext } from '../../EventContextProvider';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';



export default function AddEventPlanStageModal({ props , type }: { props: ModalProps , type : "calendar" | "event" | "housekeeping" }) {

  const localTimeZone = getLocalTimeZone();
  const {eventId , setStagesRefreshTrigger} = useEventContext();
  const router = useRouter();
  const { register, handleSubmit , control , watch } = useForm<EventStage>({
    defaultValues: {
      title: "",
      description: "",
      start: toZoned(now(localTimeZone), localTimeZone).toString(),
      end: toZoned(now(localTimeZone), localTimeZone).toString(),
    },
  });

  async function handleAddEventStage(data : EventStage) {
    if(type === "event"){
      const infos: EventStage = { ...data, eventId: eventId };
      const response = await addEventStage(infos);
      setStagesRefreshTrigger((prev) => prev + 1);
      return response;
    }
    else if(type === "calendar") {
      const response = await addCalendarEventStage(data);
      router.refresh();
      return response;
    }
    else{

    };
  };


  const onSubmit: SubmitHandler<EventStage> = async(data) => {
    const result = handleAddEventStage(data);
    await toast.promise(result, {
      loading: 'Loading...',
      success: (data) => `${data}`,
      error: (err) => `${err.toString()}`,
    }
    );
  };

  const data = watch();

  const getDateValue = (value: string) => {
    if (!value) return now(localTimeZone);
    try {
      return parseZonedDateTime(value);
    } catch {
      return now(localTimeZone);
    }
  };
  
  return (
    <div>
      <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange} className='font-segoe'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Ajouter un Stage</ModalHeader>
              <ModalBody>
                <form className='flex flex-col gap-1 items-start' onSubmit={handleSubmit(onSubmit)}>
                  <Input
                    variant='bordered'
                    color='secondary'
                    type='text'
                    {...register('title')}
                    label="Titre"
                  />
                 <Controller
                  name="start"
                  control={control}
                  render={({ field }) => (
                    <DateInput
                      label="Se commence"
                      color='secondary'
                      labelPlacement="inside"
                      value={getDateValue(field.value.toString())}
                      onChange={(date) => field.onChange(date.toString())}
                    />
                  )}
                />
                <Controller
                  name="end"
                  control={control}
                  render={({ field }) => (
                    <DateInput
                      label="Se finit"
                      color='secondary'
                      labelPlacement="inside"
                      value={getDateValue(field.value.toString())}
                      onChange={(date) => field.onChange(date.toString())}
                    />
                  )}
                />
                  <Textarea color='secondary' label="Description" placeholder="Entrer la Description" className="w-full" {...register('description')} />
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
