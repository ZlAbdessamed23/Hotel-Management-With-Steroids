import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader ,Textarea } from '@nextui-org/react';
import { CafeteriaMenu, ModalModeProps} from '@/app/types/types';
import { OperationMode } from '@/app/types/constants';
import { addCafeteriaMenu, updateCafeteriaMenu } from '@/app/utils/funcs';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';



const AddCafeteriaMenuModal: React.FC<ModalModeProps<CafeteriaMenu>> = (props) => {
  const params = useParams().id as string;
  const router = useRouter();

  const { register, handleSubmit , reset } = useForm<CafeteriaMenu>({
    defaultValues: props.initialData || {
     name : "",
     description : "",
     startTime: "",
     endTime : "",
     cafeteriaId : params,
    },
  });

  useEffect(() => {
    if (props.mode === OperationMode.update) {
      reset(props.initialData);
    };
  }, [props.initialData, reset]);

  async function handleAddCafeteriaMenu(menu : CafeteriaMenu) {
    if(props.mode === OperationMode.add){
      const response = await addCafeteriaMenu(menu);
      router.refresh();
      return response;
    }
    else{
      const response = await updateCafeteriaMenu(menu , props.initialData?.id as string);
      router.refresh();
      return response;
    };
  };

  const onSubmit: SubmitHandler<CafeteriaMenu> = async(data) => {
    const result = handleAddCafeteriaMenu(data);
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
              <ModalHeader className="flex flex-col gap-1">{props.mode === OperationMode.add ? "Ajouter" : "Editer"  } un Cafeteria Menu</ModalHeader>
              <ModalBody>
                <form className='flex flex-col gap-1 items-start' onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        variant='bordered'
                        color='secondary'
                        type='text'
                        {...register('name')}
                        label="nom complet"
                    />
                    <Input color='secondary' type='time' className='border border-white' label="temps pour commencer le petit déjeuné" {...register('startTime')} />
                    <Input color='secondary' type='time' className='border border-white' label="temps pour finir le petit déjeuné" {...register('endTime')} />
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

export default AddCafeteriaMenuModal;
