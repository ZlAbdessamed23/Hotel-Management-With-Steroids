"use client";

import { OperationMode } from '@/app/types/constants';
import { LostObj, ModalModeProps } from '@/app/types/types';
import { addLostObj, updateLostObj } from '@/app/utils/funcs';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from '@nextui-org/react';
import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useRefreshMenuContext } from '../../RefreshTriggerContext';


const AddLostObjModal: React.FC<ModalModeProps<LostObj>> = (props) => {
  const setRefreshTrigger = useRefreshMenuContext().setFetchTrigger;
  const { register, handleSubmit, reset } = useForm<LostObj>({
    defaultValues: props.initialData || {
      name: "",
      description: "",
      location: "",
    }
  });

  useEffect(() => {
    if (props.mode === OperationMode.update) {
      reset(props.initialData);
    }
    else {
      reset({
        name: "",
        description: "",
        location: "",
      });
    };
  }, [props.initialData, reset]);

  async function handleAddLostObj(data: LostObj) {
    if (props.mode === OperationMode.add) {
      console.log(data);
      const response = await addLostObj(data);
      setRefreshTrigger((curr) => curr + 1);
      return response;
    } else {
      const response = await updateLostObj(data, props.initialData?.id as string);
      setRefreshTrigger((curr) => curr + 1);
      return response;
    };
  }
  const onSubmit: SubmitHandler<LostObj> = async (data) => {
    const result = handleAddLostObj(data);
    await toast.promise(result, {
      loading: 'Loading...',
      success: (data) => `${data}`,
      error: (err) => `${err.toString()}`,
    }
    );
  };

  return (
    <div>
      <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange} className='font-segoe'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{props.mode === OperationMode.add ? "Ajouter" : "Editer"} Objet Perdu</ModalHeader>
              <ModalBody>
                <form className='flex flex-col gap-1 items-start' >
                  <Input variant='bordered' color='secondary' type='text' label="Nom d'objet" {...register('name')} />
                  <Input variant='bordered' color='secondary' type='text' label="Emplacement" {...register('location')} />
                  <Textarea color='secondary' label="Description" placeholder="Entrer votre description" className="w-full" {...register('description')} />
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

export default AddLostObjModal;