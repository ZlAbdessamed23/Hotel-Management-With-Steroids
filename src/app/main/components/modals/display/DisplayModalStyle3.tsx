import { OperationMode } from '@/app/types/constants';
import { ModalModeProps, ModalProps } from '@/app/types/types';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useCafeteriaMenuContext } from '../../CafeteriaMeniContext';
import { deleteCafeteriaMenuItem, deleteNote, deleteRestauMenuItem, deleteStockCategory, deleteTask } from '@/app/utils/funcs';
import { useRefreshMenuContext } from '../../RefreshTriggerContext';
import { TranslateObjKeysFromEngToFr } from '@/app/utils/translation';
import toast from 'react-hot-toast';
import { useStockMenuContext } from '../../StockContextProvider';

type DataType = "employee" | "stockItem" | "restauItem" | "cafetriaItem" | "task" | "note";


export default function DisplayModalStyle3<T1 extends { id?: string }>({
  props,
  data1,
  title1,
  dataType,
  SecondModal
}: {
  props: ModalProps;
  data1: T1;
  title1: string;
  dataType: DataType;
  SecondModal: React.FC<ModalModeProps<T1>>,
}) {

  const setRefreshTrigger = useRefreshMenuContext().setFetchTrigger;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  function passToSecondModal(onClose: () => void) {
    onClose();
    onOpen();
  };
  const { cafeteriaMenuId, setFetchTrigger } = useCafeteriaMenuContext();
  const stockContx = useStockMenuContext();
  const stockId = stockContx.stockId;
  const stockRefresh = stockContx.setRefreshTrigger;
  async function handleDelete() {
    switch (dataType) {
      case "cafetriaItem":
        await deleteCafeteriaMenuItem(cafeteriaMenuId, data1.id as string);
        setFetchTrigger((prev) => prev + 1);
        return "cafeteria objet a été supprimié avec succès"
      case "restauItem":
        await deleteRestauMenuItem(cafeteriaMenuId, data1.id as string);
        setFetchTrigger((prev) => prev + 1);
        return "Restau Item Deleted";
      case "note":
        await deleteNote(data1.id as string);
        setRefreshTrigger((prev) => prev + 1);
        return "Note Deleted";
      case "task":
        await deleteTask(data1.id as string);
        setRefreshTrigger((prev) => prev + 1);
        return "Task Deleted";
      case "stockItem":
        await deleteStockCategory(stockId, data1.id as string);
        stockRefresh((prev) => prev + 1);
        return "Stock Item Deleted";
    }
  };

  async function handleDeleteItem() {
    const result = handleDelete();
    await toast.promise(result, {
      loading: 'Loading...',
      success: (data) => `${data}`,
      error: (err) => `${err.toString()}`,
    }
    );
  };



  return (
    <div>
      <Modal size='lg' isOpen={props.isOpen} onOpenChange={props.onOpenChange} className='font-segoe' hideCloseButton>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {title1}
              </ModalHeader>
              <ModalBody className='flex flex-col gap-4'>
                {Object.entries(data1).map(([key, value]) => (
                  key !== "id" && (
                    <section key={key} className='flex flex-row gap-3 items-center'>
                      <span className='text-secondary'>{TranslateObjKeysFromEngToFr(key)} :</span>
                      <span className='w-64 h-6 overflow-hidden text-ellipsis'>{String(value)}</span>
                    </section>
                  )))}
              </ModalBody>
              <ModalFooter>
                <Button color="warning" variant="flat" onClick={handleDeleteItem}>
                  Supprimer
                </Button>
                <Button color="danger" variant="light" onPress={onClose}>
                  Fermer
                </Button>
                <Button color="secondary" variant="shadow" onClick={() => passToSecondModal(onClose)} >
                  Editer
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <SecondModal isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange} mode={OperationMode.update} initialData={data1} />

    </div>
  )
}
