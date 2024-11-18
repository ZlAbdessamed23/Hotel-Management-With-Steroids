import { OperationMode } from '@/app/types/constants';
import { ModalProps, SportHallClient } from '@/app/types/types';
import { addEventMember } from '@/app/utils/funcs';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';

const AddEventMemberModal: React.FC<{ props: ModalProps, eventId: string, reservationId: string }> = ({ props, eventId, reservationId }) => {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<SportHallClient>({
    defaultValues: {
      name: "",
      identityCardNumber: "",
      phoneNumber: "",
      email: "",
    },
  });

  async function handleAddEventMember(data: SportHallClient) {
    const response = await addEventMember(data, eventId, reservationId);
    router.refresh();
    return response;
  };

  const onSubmit: SubmitHandler<SportHallClient> = async (data) => {
    const result = handleAddEventMember(data);
    await toast.promise(result, {
      loading: 'Loading...',
      success: (data) => `${data}`,
      error: (err) => `${err.toString()}`,
    }
    );
  };

  return (
    <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange} className='font-segoe'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Ajouter un invité</ModalHeader>
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


export default AddEventMemberModal;