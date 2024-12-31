import { EventGuestsType, OperationMode, ReservationSource, UserGender } from '@/app/types/constants';
import { EventInvited, ModalModeProps } from '@/app/types/types';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from '@nextui-org/react';
import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEventContext } from '../../EventContextProvider';
import { addEventGuest, updateEventGuest } from '@/app/utils/funcs';
import toast from 'react-hot-toast';

const AddEventInvitedModal: React.FC<ModalModeProps<EventInvited>> = (props) => {
  const { eventId, setClientsRefreshTrigger } = useEventContext();
  const Genders = Object.values(UserGender);
  const { register, handleSubmit, reset } = useForm<EventInvited>({
    defaultValues: props.initialData || {
      fullName: "",
      address: "",
      dateOfBirth: "",
      gender: UserGender.male,
      identityCardNumber: "",
      phoneNumber: "",
      email: "",
      nationality: "",
      eventId: eventId,
      type: EventGuestsType.normal,
      reservationSource: ReservationSource.event,
    }
  });

  async function handleAddEventInvited(client: EventInvited) {
    if (props.mode === OperationMode.add) {
      const response = await addEventGuest(client);
      setClientsRefreshTrigger((prev) => prev + 1);
      return response;

    }
    else {
      console.log("weeeeeee");
      const response = await updateEventGuest(client, eventId, props.initialData?.id as string);
      setClientsRefreshTrigger((prev) => prev + 1);
      return response;
    };
  };

  const onSubmit: SubmitHandler<EventInvited> = async (data) => {
    const result = handleAddEventInvited(data);
    await toast.promise(result, {
      loading: 'Loading...',
      success: (data) => `${data}`,
      error: (err) => `${err.toString()}`,
    }
    );
  };

  useEffect(() => {
    if (props.mode === OperationMode.update) {
      reset({ ...props.initialData, dateOfBirth: props.initialData?.dateOfBirth ? new Date(props.initialData.dateOfBirth).toISOString().split('T')[0] : "" }, { keepDefaultValues: false });
    };
  }, [props.initialData, props.mode]);

  return (
    <>
      <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange} className='font-segoe'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{props.mode === OperationMode.add ? "Ajouter" : "Editer"} un invité</ModalHeader>
              <ModalBody>
                <form className='flex flex-col gap-1 items-start' onSubmit={handleSubmit(onSubmit)}>
                  <Input variant='bordered' color='secondary' type='text' label="Nom complet" {...register('fullName')} />
                  <Input variant='bordered' color='secondary' type='text' label="Adresse" {...register('address')} />
                  <Input variant='bordered' color='secondary' type='date' label="Date de naissance" {...register('dateOfBirth')} />
                  <Input variant='bordered' color='secondary' type='text' label="Email" {...register('email')} />
                  <Input variant='bordered' color='secondary' type='text' label="Téléphone" {...register('phoneNumber')} />
                  <Input variant='bordered' color='secondary' type='text' label="Nationalité" {...register('nationality')} />
                  <Input variant='bordered' color='secondary' type='text' label="numéro du carte d'identité" {...register('identityCardNumber')} />
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
                <Button color="primary" type="submit" onClick={handleSubmit(onSubmit)}>
                  Sauvegarder
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddEventInvitedModal;
