import { OperationMode } from '@/app/types/constants';
import { ModalModeProps, ModalProps, Note } from '@/app/types/types';
import { addNote, updateNote } from '@/app/utils/funcs';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Textarea } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRefreshMenuContext } from '../../RefreshTriggerContext';
import toast from 'react-hot-toast';

const AddNoteModal: React.FC<ModalModeProps<Note>> = (props) => {
  const setRefreshTrigger = useRefreshMenuContext().setFetchTrigger;
  const { register, handleSubmit, reset } = useForm<Note>({
    defaultValues: props.initialData || {
      title: "",
      description: "",
      deadline: "",
    }
  });

  useEffect(() => {
    if (props.mode === OperationMode.update) {
      reset({...props.initialData , deadline : props.initialData?.deadline ? new Date(props?.initialData?.deadline).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]});
    };
  }, [props.initialData, reset]);

  async function handleAddNote(data : Note) {
    if(props.mode === OperationMode.add){
      const response = await addNote(data);
      setRefreshTrigger((prev) => prev + 1);
      return response;
    }
    else{
      const response = await updateNote(data , props.initialData?.id as string);
      setRefreshTrigger((prev) => prev + 1);
      return response;
    };
  }
  
  const onSubmit : SubmitHandler<Note> = async(data) => {
    const result = handleAddNote(data);
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
            <ModalHeader className="flex flex-col gap-1">Ajouter une Note</ModalHeader>
            <ModalBody>
              <form className='flex flex-col gap-1 items-start' >
                <Input variant='bordered' color='secondary' type='text' label="Titre" {...register('title')} />
                <Input variant='bordered' color='secondary' type='date' label="Délai" {...register('deadline')} />
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

export default AddNoteModal;