import { Coach, ModalModeProps, SportHall } from '@/app/types/types';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Textarea, Selection } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { DaysOfWeek, OperationMode, SportHalls } from '@/app/types/constants';
import { addGym, getGymLiteCoaches, updateGym } from '@/app/utils/funcs';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const AddGymModal: React.FC<ModalModeProps<SportHall>> = (props) => {
  const Sports = Object.values(SportHalls);
  const WeekDays = Object.values(DaysOfWeek);
  const router = useRouter();
  const [selectedCoaches, setSelectedCoaches] = useState<Selection>(props.initialData?.coaches ? new Set([((props.initialData.coaches as string[]).join(","))]) : new Set([]));
  const [coaches, setCoaches] = useState<{ id: string, firstName: string, lastName: string }[]>([]);
  const [selectedWorkingDays, setSelectedWorkingDays] = useState<Selection>(props.initialData?.openingDays ? new Set([...(props.initialData.openingDays as DaysOfWeek[])]) : new Set([]));

  const { register, handleSubmit, reset , watch } = useForm<SportHall>({
    defaultValues: props.initialData || {
      name: "",
      description: "",
      location: undefined,
      type: SportHalls.tennis,
      openingDays: undefined,
      capacity: 0,
      price: undefined,
      coaches: undefined,
    }
  });

  async function handleAddGym(data: SportHall) {
    if (props.mode === OperationMode.add) {
      const response = await addGym(data);
      router.refresh();
      return response;
    }
    else {
      const response = await updateGym(data, props.initialData?.id as string);
      router.refresh();
      return response;
    };
  };

  const onSubmit: SubmitHandler<SportHall> = async (data) => {
    const result = handleAddGym(data);
    await toast.promise(result, {
      loading: 'Loading...',
      success: (data) => `${data}`,
      error: (err) => `${err.toString()}`,
    }
    );
  };

  async function getCurrentGymCoaches() {
    const data = await getGymLiteCoaches();
    setCoaches(data.coaches);
  };

  useEffect(() => {
    getCurrentGymCoaches();
    if (props.mode === OperationMode.add) {
      reset({
        name: "",
        description: "",
        location: undefined,
        type: SportHalls.tennis,
        openingDays: undefined,
        capacity: 0,
        price: undefined,
        coaches: undefined,
      })
    }
    else {
      if (props.initialData) {
        const data: SportHall | undefined = props.initialData ? {
          ...props.initialData, openingDays: props.initialData.openingDays && (props.initialData?.openingDays as DaysOfWeek[]).join(','), coaches: props.initialData.coaches && (props.initialData?.coaches as string[]).join(',')
        } : undefined;
        reset(data);
        setTimeout(() => {
          setSelectedWorkingDays(props.initialData?.openingDays ? new Set([...(props.initialData.openingDays as DaysOfWeek[])]) : new Set([]))
          setSelectedCoaches(props.initialData?.coaches ? new Set([(props.initialData.coaches as string[]).join(",")]) : new Set([]))
        }, 0);
      }
    };
  }, [props.initialData]);


  return (
    <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange} className='font-segoe'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{props.mode === OperationMode.add ? "Ajouter" : "Editer"} une Salle de Sport</ModalHeader>
            <ModalBody>
              <form className='flex flex-col gap-1 items-start' >
                <Input variant='bordered' color='secondary' type='text' label="Nom" {...register('name')} />
                <Input variant='bordered' color='secondary' type='text' label="Location" {...register('location')} />
                <Input variant='bordered' color='secondary' type='number' label="Capacité" {...register('capacity')} />
                <Input variant='bordered' color='secondary' type='number' label="Prix" {...register('price')} />
                <Select color='secondary' label="Le type de la Salle" className="w-full" {...register('type')}>
                  {Sports.map((sport) => (
                    <SelectItem key={sport} value={sport}>
                      {sport}
                    </SelectItem>
                  ))}
                </Select>
                <Select selectedKeys={selectedWorkingDays} color='secondary' label="Les Jours de travail" className="w-full" {...register('openingDays')} onSelectionChange={setSelectedWorkingDays} selectionMode='multiple'>
                  {WeekDays.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </Select>
                <Select selectedKeys={selectedCoaches} onSelectionChange={setSelectedCoaches} color='secondary' label="Les Entraineurs de la salle" className="w-full" {...register('coaches')} selectionMode='multiple'>
                  {coaches.map((coach) => (
                    <SelectItem key={coach.id} value={coach.id}>
                      {coach.firstName + coach.lastName}
                    </SelectItem>
                  ))}
                </Select>
                <Textarea color='secondary' label="Description" placeholder="Enter your description" className="w-full" {...register('description')} />
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


export default AddGymModal;