import { OperationMode } from '@/app/types/constants';
import { ModalModeProps, SportHallClient } from '@/app/types/types';
import { addGymMember,updateGymMember } from '@/app/utils/funcs';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react';
import React, { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form';
import { useGymMenuContext } from '../../GymContextProvider';
import toast from 'react-hot-toast';

const AddGymClientModal: React.FC<ModalModeProps<SportHallClient>> = (props) => {
  const {gymId , setRefreshTrigger} = useGymMenuContext();

  const { register, handleSubmit, reset } = useForm<SportHallClient>({
    defaultValues: props.initialData || {
      name: "",
      identityCardNumber: "",
      phoneNumber: "",
      email: "",
    },
  });

  useEffect(() => {
    if (props.mode === OperationMode.update) {
      reset(props.initialData);
    }
    else {
      reset({
        name: "",
        identityCardNumber: "",
        phoneNumber: "",
        email: "",
      });
    };
  }, [props.initialData, reset]);


  async function handleAddGymClient(data: SportHallClient) {
    if (props.mode === OperationMode.add && gymId != "") {
      const response = await addGymMember(data, gymId);
      setRefreshTrigger((curr) => curr + 1);
      return response;
    }
    else {
      const response = await updateGymMember(data, props.initialData?.id as string);
      setRefreshTrigger((curr) => curr + 1);
      return response;
    }
  }
  const onSubmit: SubmitHandler<SportHallClient> = async (data) => {
    const result = handleAddGymClient(data);
    await toast.promise(result, {
      loading: 'Loading...',
      success: (data) => `${data}`,
      error: (err) => `${err.toString()}`,
    }
    );
  };
  return (
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
                  {...register('identityCardNumber')}
                  label="Numéro de la carte nationale"
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
  )
}


export default AddGymClientModal;