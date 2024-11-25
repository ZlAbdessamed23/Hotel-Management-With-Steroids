import { ModalProps, ReportType } from '@/app/types/types';
import { addReport, getLiteEmployees, getLiteEmployees2 } from '@/app/utils/funcs';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Textarea, Selection } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const AddReportModal: React.FC<ModalProps> = (props) => {
  const router = useRouter();
  const { register, handleSubmit , setValue } = useForm<ReportType>({
    defaultValues: {
      title: "",
      content: "",
      receivers: "",
      description: "",
    }
  });

  async function handleAddReport(data: ReportType) {
    const response = await addReport(data);
    router.refresh();
    return response;
  };

  const onSubmit: SubmitHandler<ReportType> = async (data) => {
    const result = handleAddReport(data);
    await toast.promise(result, {
      loading: 'Loading...',
      success: (data) => `${data}`,
      error: (err) => `${err.toString()}`,
    }
    );
  };

  const [receivers, setReceivers] = useState<Array<{ id: string, firstName: string, lastName: string, role: string }>>([]);
  const [selectedReceivers, setSelectedReceivers] = useState<Selection>(new Set([]));

  async function getReceivers() {
    const employees: { id: string, firstName: string, lastName: string, role: string }[] = (await getLiteEmployees2()).Employees;
    setReceivers(employees);
  };

  const getSelectedItems = () => {
    const selected = Array.from(selectedReceivers);
    return selected.map(id => {
      const receiver = receivers.find(r => r.id === id);
      return receiver ? `${receiver.firstName} ${receiver.lastName}` : '';
    }).join(', ');
  };

  const handleSelectionChange = (selection: Set<string>) => {
    setSelectedReceivers(selection);
    setValue('receivers', Array.from(selection).join(','));
  };

  useEffect(() => {
    getReceivers();
  }, []);

  return (
    <div>
      <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange} className='font-segoe'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Ajouter une T&acirc;che</ModalHeader>
              <ModalBody>
                <form className='flex flex-col gap-1 items-start' onSubmit={handleSubmit(onSubmit)}>
                  <Input variant='bordered' color='secondary' type='text' label="Titre" {...register('title')} />
                  <Select selectedKeys={selectedReceivers} onSelectionChange={(keys) => handleSelectionChange(keys as Set<string>)}
                    selectionMode='multiple' color='secondary' label="Envoyée à" className="w-full" {...register('receivers')} 
                    renderValue={(items) => {
                      return (
                        <div className="flex flex-wrap gap-2">
                          {items.map((item) => (
                            <div key={item.key} className="flex items-center">
                              {receivers.find(r => r.id === item.key)?.firstName} {receivers.find(r => r.id === item.key)?.lastName}
                            </div>
                          ))}
                        </div>
                      );
                    }}
                    >
                    {receivers.map((receiver) => (
                      <SelectItem key={receiver.id} value={receiver.id}>
                        {receiver.firstName} {receiver.lastName}--{receiver.role}
                      </SelectItem>
                    ))}
                  </Select>
                  <Textarea color='secondary' label="Description" placeholder="Enter your description" className="w-full" {...register('description')} />
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>Fermer</Button>
                <Button color="primary" variant='shadow' type="submit" onClick={handleSubmit(onSubmit)}>Sauvegarder</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}


export default AddReportModal;
