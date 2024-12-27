import { ModalProps, StockBudget } from '@/app/types/types';
import { editBudget } from '@/app/utils/funcs';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useRefreshMenuContext } from '../../RefreshTriggerContext';

export default function AddBudgetModal({
  props,
  initialData,
}: {
  props: ModalProps;
  initialData: StockBudget[];
}) {
  const router = useRouter();
  const { setFetchTrigger } = useRefreshMenuContext();
  const { register, handleSubmit, reset, control } = useForm<{ stocks: StockBudget[] }>({
    defaultValues: { stocks: initialData || [] },
  });

  const { fields } = useFieldArray({
    control,
    name: 'stocks',
  });

  async function handleAdd(data: { stocks: StockBudget[] }) {
    const message = await editBudget(data.stocks);
    setFetchTrigger((curr) => curr + 1);
    return message;
  };

  const onSubmit: SubmitHandler<{ stocks: StockBudget[] }> = async (data) => {
    console.log(data);
    const result = handleAdd(data);
    await toast.promise(result, {
      loading: 'Loading...',
      success: (data) => `${data}`,
      error: (err) => `${err.toString()}`,
    });
  };

  useEffect(() => {
    reset({ stocks: initialData });
  }, [initialData, reset]);

  return (
    <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange} className="font-segoe">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Editer le Budget</ModalHeader>
            <ModalBody>
              <form className="flex flex-col gap-3 items-start" onSubmit={handleSubmit(onSubmit)}>
                {fields.map((field, index) => (
                  <div key={field.id} className="flex flex-row items-center gap-6 w-full">
                    <label className="font-semibold text-lg text-gray-700 dark:text-gray-200">
                      {field.stockName}:
                    </label>
                    <Input
                      variant="bordered"
                      color="secondary"
                      type="number"
                      {...register(`stocks.${index}.amount`, { valueAsNumber: true })}
                      placeholder="Enter budget"
                    />
                  </div>
                ))}
              </form>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Fermer
              </Button>
              <Button color="primary" variant="shadow" onClick={handleSubmit(onSubmit)}>
                Sauvegarder
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
