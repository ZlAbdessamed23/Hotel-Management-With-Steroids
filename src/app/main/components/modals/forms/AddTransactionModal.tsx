import { StockTransactionType } from '@/app/types/constants';
import { Budget, ModalProps, StockTransaction, StockType } from '@/app/types/types';
import { addTransaction } from '@/app/utils/funcs';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem } from '@nextui-org/react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useStockMenuContext } from '../../StockContextProvider';


interface AddTransactionModalProps {
  props: ModalProps
  items: { id: string; name: string }[];
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ props, items }) => {
  const stockId = useStockMenuContext().stockId;
  const router = useRouter();
  const path = usePathname();
  const location: StockType = path.includes("sport&spa") ? "spa" : path.includes("material") ? "material" : "restaurant";
  const TransactionTypes = Object.values(StockTransactionType);
  const { register, handleSubmit } = useForm<StockTransaction>({
    defaultValues: {
      quantity: 0,
      type: StockTransactionType.purchase,
      stockItemId: "",
      stockId: stockId,
    },
  });

  async function handleAddTransaction(data: StockTransaction) {
    const response = await addTransaction(data);
    router.refresh();
    return response;
  };

  const onSubmit: SubmitHandler<StockTransaction> = async (data) => {
    const result = handleAddTransaction(data);
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
            <ModalHeader className="flex flex-col gap-1">Ajouter une Transaction</ModalHeader>
            <ModalBody>
              <form className='flex flex-col gap-1 items-start' onSubmit={handleSubmit(onSubmit)}>
                <Input
                  variant='bordered'
                  color='secondary'
                  type='number'
                  {...register('quantity')}
                  label="Quantité"
                />
                <Select color='secondary' label="Type de Transaction" className="w-full" {...register('type')}>
                  {TransactionTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </Select>
                <Select color='secondary' label="l'objet du stock" className="w-full" {...register('stockItemId')}>
                  {items.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </Select>
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
    </Modal>)
};

export default AddTransactionModal;
