import { OperationMode } from '@/app/types/constants';
import { ModalModeProps, Note, Task } from '@/app/types/types';
import { addTask, getLiteEmployees, updateTask } from '@/app/utils/funcs';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, Selection, SelectItem, Textarea } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useRefreshMenuContext } from '../../RefreshTriggerContext';

const AddTaskModal: React.FC<ModalModeProps<Task>> = (props) => {
  const setRefreshTrigger = useRefreshMenuContext().setFetchTrigger;
  const [selectedReceivers, setSelectedReceivers] = useState<Selection>(new Set([]));
  const { register, handleSubmit, reset } = useForm<Task>({
    defaultValues: props.initialData || {
      title: "",
      description: "",
      deadline: "",
      receivers: "",
      isDone: false,
    }
  });

  async function handleAddTask(data: Task) {
    if (props.mode === OperationMode.add) {
      const response = await addTask(data);
      setRefreshTrigger((curr) => curr + 1);
      return response;
    }
    else {
      const response = await updateTask(data, props.initialData?.id as string);
      setRefreshTrigger((curr) => curr + 1);
      return response;
    };
  }

  const onSubmit: SubmitHandler<Task> = async (data) => {
    const result = handleAddTask(data);
    await toast.promise(result, {
      loading: 'Loading...',
      success: (data) => `${data}`,
      error: (err) => `${err.toString()}`,
    }
    );
  };

  const [receivers, setReceivers] = useState<Array<{ firstName: string, id: string }>>([]);

  useEffect(() => {
    if (props.mode === OperationMode.update) {
      const receiversArr = props.initialData?.assignedEmployees?.map((employee) => employee.employee.id);
      const initialData: Task | Note = {
        title: props.initialData?.title || "",
        isDone: props.initialData?.isDone || false,
        description: props.initialData?.description || "",
        deadline: props.initialData?.deadline ? new Date(props.initialData.deadline).toISOString().split('T')[0] : "",
        receivers: receiversArr?.join(',') || "",
      }
      reset(initialData);

      setTimeout(() => {
        setSelectedReceivers(new Set(receiversArr));
      }, 0);
    };
  }, [props.initialData, reset]);

  async function getReceivers() {
    const employees: { id: string, firstName: string }[] = (await getLiteEmployees()).Employees;
    setReceivers(employees);
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
                  <Input variant='bordered' color='secondary' type='date' label="Délai" {...register('deadline')} />
                  <Select selectedKeys={selectedReceivers} onSelectionChange={setSelectedReceivers} selectionMode='multiple' color='secondary' label="Envoyée à" className="w-full" {...register('receivers')}>
                    {receivers.map((receiver) => (
                      <SelectItem key={receiver.id} value={receiver.id}>
                        {receiver.firstName}
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


export default AddTaskModal;
