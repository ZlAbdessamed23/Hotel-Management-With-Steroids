import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Textarea, TimeInputValue } from '@nextui-org/react';
import { ModalModeProps, Restau_CafeteriaItem } from '@/app/types/types';
import { OperationMode, Restau_CafeteriaItemCategories } from '@/app/types/constants';
import { addCafeteriaMenuItem, addRestauMenuItem, updateCafeteriaMenuItem, updateRestauMenuItem } from '@/app/utils/funcs';
import { useCafeteriaMenuContext } from '../../CafeteriaMeniContext';
import toast from 'react-hot-toast';

const AddRestau_CafeteriaItemModal: React.FC<ModalModeProps<Restau_CafeteriaItem>> = (props) => {

  const { cafeteriaMenuId, setFetchTrigger, fetchType } = useCafeteriaMenuContext();
  const Categories = Object.values(Restau_CafeteriaItemCategories);
  const MealTypes = ["lunch", "dinner"];
  const { register, handleSubmit, reset } = useForm<Restau_CafeteriaItem>({
    defaultValues: props.initialData || {
      name: "",
      description: "",
      category: Restau_CafeteriaItemCategories.cafe,
      mealType: "lunch",
    },
  });

  useEffect(() => {
    if (props.mode === OperationMode.update) {
      reset(props.initialData);
    } else {
      reset({
        name: "",
        description: "",
        category: Restau_CafeteriaItemCategories.cafe,
      });
    };
  }, [props.initialData, reset]);


  async function handleAddFoodItem(data: Restau_CafeteriaItem) {
    if (fetchType === "cafeteria") {
      if (props.mode === OperationMode.add) {
        const response = await addCafeteriaMenuItem(data, cafeteriaMenuId);
        setFetchTrigger((prev) => prev + 1);
        return response;
      }
      else {
        const response = await updateCafeteriaMenuItem(data, cafeteriaMenuId);
        setFetchTrigger((prev) => prev + 1);
        return response;
      };
    }
    else {
      if (props.mode === OperationMode.add) {
        const response = await addRestauMenuItem(data, cafeteriaMenuId);
        setFetchTrigger((prev) => prev + 1);
        return response;
      }
      else {
        const response = await updateRestauMenuItem(data, cafeteriaMenuId);
        setFetchTrigger((prev) => prev + 1);
        return response;
      };
    }
  };

  const onSubmit: SubmitHandler<Restau_CafeteriaItem> = async (data) => {
    const result = handleAddFoodItem(data);
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
              <ModalHeader className="flex flex-col gap-1">{props.mode === OperationMode.add ? "Ajouter" : "Editer"} un repas Ou un boisson</ModalHeader>
              <ModalBody>
                <form className='flex flex-col gap-1 items-start' onSubmit={handleSubmit(onSubmit)}>
                  <Input
                    variant='bordered'
                    color='secondary'
                    type='text'
                    className='border border-white'
                    {...register('name')}
                    label="nom complet"
                  />
                  <Select color='secondary' label="Catégorie" className="w-full" {...register('category')}>
                    {Categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </Select>
                  {
                    fetchType === "restau" && <Select color='secondary' label="le type de repas" className="w-full" {...register('mealType')}>
                      {MealTypes.map((mealType) => (
                        <SelectItem key={mealType} value={mealType}>
                          {mealType === "lunch" ? "le déjeuné" : "le dinner"}
                        </SelectItem>
                      ))}
                    </Select>
                  }
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

export default AddRestau_CafeteriaItemModal;
