import { EventGuestsType, ReservationSource, UserGender } from '@/app/types/constants';
import { EventOrganiser, ModalModeProps } from '@/app/types/types';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from '@nextui-org/react';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEventContext } from '../../EventContextProvider';
import { addEventOrganiser } from '@/app/utils/funcs';
import toast from 'react-hot-toast';


const AddOrganizerModal: React.FC<ModalModeProps<EventOrganiser>> = (props) => {
  
  const Genders = Object.values(UserGender);
  const {eventId , setClientsRefreshTrigger} = useEventContext();
  const { register, handleSubmit, reset } = useForm<EventOrganiser>({
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
      reservationSource: ReservationSource.event,
      type: EventGuestsType.organiser,
    }
  });
  async function handleAddOrganizer(data : EventOrganiser ) {
    const response = await addEventOrganiser(data);
    setClientsRefreshTrigger((prev) => prev + 1);
    return response;
  };

  const onSubmit : SubmitHandler<EventOrganiser> = async(data) => {
    const result = handleAddOrganizer(data);
      await toast.promise(result, {
        loading: 'Loading...',
        success: (data) => `${data}`,
        error: (err) => `${err.toString()}`,
      }
      );
  };

  return (
    <div>
      <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange} className='font-segoe' scrollBehavior='inside'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Ajouter un Organisateur</ModalHeader>
              <ModalBody>
                <form className='flex flex-col gap-1 items-start' >
                  <Input variant='bordered' color='secondary' type='text' label="Nom Complet" {...register('fullName')} />
                  <Input variant='bordered' color='secondary' type='text' label="Adresse" {...register('address')} />
                  <Input variant='bordered' color='secondary' type='date' label="Date de Naissance" {...register('dateOfBirth')} />
                  <Select color='secondary' label="Sexe" className="w-full" {...register('gender')}>
                    {Genders.map((gender) => (
                      <SelectItem key={gender} value={gender}>
                        {gender}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input variant='bordered' color='secondary' type='text' label="Numéro de Carte d'identité" {...register('identityCardNumber')} />
                  <Input variant='bordered' color='secondary' type='text' label="Numéro de Téléphone" {...register('phoneNumber')} />
                  <Input variant='bordered' color='secondary' type='text' label="Email" {...register('email')} />
                  <Input variant='bordered' color='secondary' type='text' label="Nationalité" {...register('nationality')} />
                  {/* <Input variant='bordered' color='secondary' type='text' label="Rôle" {...register('role')} /> */}
                  {/* <Select color='secondary' label="Etat" className="w-full" {...register('state')}>
                    {States.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </Select> */}
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


export default AddOrganizerModal;