import { OperationMode, Units } from '@/app/types/constants';
import { ModalModeProps, StockCategory, StockItem, StockType } from '@/app/types/types';
import { addStockItem, getStockCategories, updateStockItem } from '@/app/utils/funcs';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Textarea, Selection } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useStockMenuContext } from '../../StockContextProvider';

const AddStockItemModal: React.FC<ModalModeProps<StockItem>> = (props) => {
  const stockId = useStockMenuContext().stockId;
  const [categories, setCategories] = useState<StockCategory[]>([]);
  const UnitTypes = Object.values(Units);
  const router = useRouter();
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [selectedUnitsKeys, setSelectedUnitsKeys] = useState<Selection>(new Set([]));
  const { register, handleSubmit, reset, watch } = useForm<StockItem>({
    defaultValues: props.initialData || {
      name: "",
      category: "",
      description: "",
      quantity: 0,
      minimumQuantity: 0,
      sku: "",
      unit: "",
      supplierName: "",
      supplierAddress: "",
      supplierPhone: "",
      supplierEmail: "",
      stockId: stockId,
      unitPrice: 0,
    }
  });

  async function handleAddStockItem(data: StockItem) {
    if (props.mode === OperationMode.add) {
      const response = await addStockItem(data);
      router.refresh();
      return response;
    }
    else {
      const response = await updateStockItem(stockId ,props.initialData?.id as string, data);
      router.refresh();
      return response;
    };
  };

  const onSubmit: SubmitHandler<StockItem> = async (data: StockItem) => {
    const result = handleAddStockItem(data);
    await toast.promise(result, {
      loading: 'Loading...',
      success: (data) => `${data}`,
      error: (err) => `${err.toString()}`,
    }
    );
  };

  const quantity = watch('quantity', 0) as number;
  const unitPrice = watch('unitPrice', 0) as number;

  async function getCategories() {
    const data = await getStockCategories(stockId);
    setCategories(data.Categories);
  };
  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (props.mode === OperationMode.update) {
      const category = categories.filter((category) => category.id === props.initialData?.categoryId);
      reset({ ...props.initialData, category: category[0].name });
      setTimeout(() => {
        setSelectedUnitsKeys(new Set([props.initialData?.category as string]));
        setSelectedKeys(new Set([category[0].id as string]));
      }, 0);
    }
    else {
      reset({
        name: "",
        category: "",
        description: "",
        quantity: 0,
        minimumQuantity: 0,
        sku: "",
        supplierName: "",
        unit: "",
        supplierAddress: "",
        supplierPhone: "",
        supplierEmail: "",
        stockId: stockId,
        unitPrice: 0,
      });
      setTimeout(() => {
        setSelectedKeys(new Set([]));
        setSelectedUnitsKeys(new Set([]));
      }, 0);
    };
  }, [props.initialData, reset]);

  return (
    <div>
      <Modal scrollBehavior='inside' isOpen={props.isOpen} onOpenChange={props.onOpenChange} className='font-segoe'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Ajouter un Objet</ModalHeader>
              <ModalBody>
                <form className='flex flex-col gap-1 items-start' onSubmit={handleSubmit(onSubmit)}>
                  <Input variant='bordered' color='secondary' type='text' label="Nom" {...register('name')} />
                  <Select selectedKeys={selectedUnitsKeys} onSelectionChange={setSelectedUnitsKeys} color='secondary' label="Unité" className="w-full" {...register('unit')}>
                    {UnitTypes?.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </Select>                  
                  <Input variant='bordered' color='secondary' type='number' label="quantité déja présente" {...register('quantity', { valueAsNumber: true })} />
                  <Input variant='bordered' color='secondary' type='number' label="minimum quantité nécéssaire" {...register('minimumQuantity', { valueAsNumber: true })} />
                  <Input variant='bordered' color='secondary' type='text' label="Numéro spéciale du produit" {...register('sku')} />
                  <Select selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys} color='secondary' label="Category" className="w-full" {...register('category')}>
                    {categories?.map((category) => (
                      <SelectItem key={category.id || ""} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </Select>
                  <Textarea color='secondary' label="Description" placeholder="Entrer la Description de l'objet" className="w-full" {...register('description')} />
                  <Input variant='bordered' color='secondary' type='number' label="prix d'unité" {...register('unitPrice')} />
                  <Input variant='bordered' color='secondary' type='text' label="Nom du fournisseur" {...register('supplierName')} />
                  <Input variant='bordered' color='secondary' type='text' label="Address du fournisseur" {...register('supplierAddress')} />
                  <Input variant='bordered' color='secondary' type='text' label="Email du fournisseur" {...register('supplierEmail')} />
                  <Input variant='bordered' color='secondary' type='text' label="Numéro de Téléphone du fournisseur" {...register('supplierPhone')} />
                </form>
                <p className='text-center text-2xl font-semibold text-secondary'>
                  {quantity && unitPrice ? `Total: ${quantity * unitPrice}` : ""}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>Fermer</Button>
                <Button color="primary" variant="shadow" type="submit" onClick={handleSubmit(onSubmit)}>Sauvegarder</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AddStockItemModal;
