"use client";

import { OperationMode } from '@/app/types/constants';
import { ModalModeProps, StockCategory } from '@/app/types/types';
import { addStockCategory, updateStockCategory } from '@/app/utils/funcs';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from '@nextui-org/react';
import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useStockMenuContext } from '../../StockContextProvider';

const AddStockCategoryModal: React.FC<ModalModeProps<StockCategory>> = (props) => {
  const { stockId, setRefreshTrigger } = useStockMenuContext();
  const { register, handleSubmit, watch, reset } = useForm<StockCategory>({
    defaultValues: props.initialData || {
      name: "",
      description: "",
      stockId: stockId,
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
        stockId: stockId
      });
    };
  }, [props.initialData, reset]);


  async function handleAddStockCategory(data: StockCategory) {
    if (props.mode === OperationMode.add) {
      const response = await addStockCategory(data);
      setRefreshTrigger((curr) => curr + 1);
      return response;
    } else {
      const response = await updateStockCategory(stockId, props.initialData?.id as string, data);
      setRefreshTrigger((curr) => curr + 1);
      return response;
    };
  }
  const onSubmit: SubmitHandler<StockCategory> = async (data) => {
    const result = handleAddStockCategory(data);
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
              <ModalHeader className="flex flex-col gap-1">Ajouter une Cat&eacute;gorie</ModalHeader>
              <ModalBody>
                <form className='flex flex-col gap-1 items-start' >
                  <Input variant='bordered' color='secondary' type='text' label="Nom de la Catégorie" {...register('name')} />
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
    </div>
  );
}


export default AddStockCategoryModal;