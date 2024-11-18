import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from '@nextui-org/react';
import { ModalModeProps, RestauMenu } from '@/app/types/types';
import { OperationMode } from '@/app/types/constants';
import { useParams, useRouter } from 'next/navigation';
import { addRestauMenu, updateRestauMenu } from '@/app/utils/funcs';
import toast from 'react-hot-toast';


const AddRestauMenuModal: React.FC<ModalModeProps<RestauMenu>> = (props) => {
  const params= useParams().id as string;
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<RestauMenu>({
    defaultValues: props.initialData || {
      name: "",
      description: "",
      lunchStartTime: "",
      lunchEndTime: "",
      dinnerStartTime: "",
      dinnerEndTime: "",
      restaurantId : params,
    },
  });

  useEffect(() => {
    if (props.mode === OperationMode.update) {
      reset(props.initialData);
    };
  }, [props.initialData, reset]);

  useEffect(() => {
    console.log(params);
  },[params])

  async function handleAddRestauMenu(data: RestauMenu) {
    if (props.mode === OperationMode.add) {
      const response = await addRestauMenu(data);
      router.refresh();
      return response;
    }
    else {
      const response = await updateRestauMenu(data, props.initialData?.id as string);
      router.refresh();
      return response;
    };
  };

  const onSubmit: SubmitHandler<RestauMenu> = async (data) => {
    const result = handleAddRestauMenu(data);
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
              <ModalHeader className="flex flex-col gap-1">{props.mode === OperationMode.add ? "Ajouter" : "Editer"} un Restau-menu</ModalHeader>
              <ModalBody>
                <form className='flex flex-col gap-1 items-start'>
                  <Input
                    variant='bordered'
                    color='secondary'
                    type='text'

                    {...register('name')}
                    label="nom complet"
                  />
                  <Input color='secondary' type='time' label="temps pour commencer le déjeuné" {...register('lunchStartTime')} />
                  <Input color='secondary' type='time' label="temps pour finir le déjeuné" {...register('lunchEndTime')} />
                  <Input color='secondary' type='time' label="temps pour commencer le dinner" {...register('dinnerStartTime')} />
                  <Input color='secondary' type='time' label="temps pour finir le dinner" {...register('dinnerEndTime')} />
                  <Textarea color='secondary' label="Description" placeholder="Enter your description" className="w-full" {...register('description')} />
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

export default AddRestauMenuModal;
