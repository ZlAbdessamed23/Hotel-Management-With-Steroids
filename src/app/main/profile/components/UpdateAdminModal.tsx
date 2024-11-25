import { ModalProps,SelfUpdateAdmin } from '@/app/types/types'
import { updateSelfAdmin } from '@/app/utils/funcs';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Button } from '@nextui-org/react'
import { useRouter } from 'next/navigation';
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function UpdateAdminModal({ props, initialData }: { props: ModalProps, initialData: SelfUpdateAdmin }) {
  const router = useRouter();
  const { register, handleSubmit} = useForm<SelfUpdateAdmin>({
    defaultValues: {
      ...initialData , dateOfBirth : initialData.dateOfBirth ? new Date(initialData.dateOfBirth).toISOString().split('T')[0] : new Date()
    }
  });

  async function handleUpdate(data: SelfUpdateAdmin) {
    const message = await updateSelfAdmin(data);
    router.refresh();
    return message;
  };

  const onSubmit: SubmitHandler<SelfUpdateAdmin> = async (data) => {
    const result = handleUpdate(data);
    await toast.promise(result, {
      loading: 'Loading...',
      success: (data) => `${data}`,
      error: (err) => `${err.toString()}`,
    }
    );
  };

  return (
    <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange} className='font-segoe z-50' scrollBehavior="inside">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Ajouter un Employé</ModalHeader>
            <ModalBody>
              <form className='flex flex-col gap-1 items-start' >
                <Input variant='bordered' color='secondary' type='text' label="Nom" {...register('firstName')} />
                <Input variant='bordered' color='secondary' type='text' label="Prénom" {...register('lastName')} />
                <Input variant='bordered' color='secondary' type='text' label="Adresse" {...register('address')} />
                <Input variant='bordered' color='secondary' type='date' label="Date de naissance" {...register('dateOfBirth')} />
                <Input variant='bordered' color='secondary' type='text' label="Mot de Passse" {...register('password')} />
                <Input variant='bordered' color='secondary' type='text' label="Téléphone" {...register('phoneNumber')} />
                <Input variant='bordered' color='secondary' type='text' label="Nationalité" {...register('nationality')} />
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
    </Modal>)
}
