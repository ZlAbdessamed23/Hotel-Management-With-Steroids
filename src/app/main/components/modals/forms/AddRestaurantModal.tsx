"use client";

import { OperationMode, UserRole } from '@/app/types/constants';
import { ModalModeProps, Restaurant, Stock } from '@/app/types/types';
import { addRestaurant, addStock, getLiteEmployees2, updateRestaurant, updateStock } from '@/app/utils/funcs';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, Selection, Select, SelectItem } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useRefreshMenuContext } from '../../RefreshTriggerContext';

const AddRestaurantModal: React.FC<ModalModeProps<Restaurant>> = (props) => {
  const setRefreshTrigger = useRefreshMenuContext().setFetchTrigger;
  const [employees, setEmployees] = useState<{ id: string, firstName: string, lastName: string, role: UserRole | string }[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<Selection>();

  const { register, handleSubmit, reset } = useForm<Restaurant>({
    defaultValues: props.initialData || {
      name: "",
      description: "",
      location: "",
      restaurantEmployee: "",
    }
  });

  async function getReceivers() {
    const employees: { id: string, firstName: string, lastName: string, role: string }[] = (await getLiteEmployees2()).Employees;
    setEmployees(employees);
  };

  useEffect(() => {
    if (props.mode === OperationMode.update) {
      const assignedEmpls = (props.initialData?.restaurantEmployee as Array<{ employeeId: string, firstName: string, lastName: string, role: string }>).map((employee) => employee.employeeId);
      const initialData: Restaurant = {
        name: props.initialData?.name || "",
        location: props.initialData?.location || "",
        description: props.initialData?.description || "",
        restaurantEmployee: assignedEmpls?.join(',') || "",
      }
      reset(initialData);
      setTimeout(() => {
        setSelectedKeys(new Set(assignedEmpls));
      }, 0);
      reset(props.initialData);
    }
    else {
      reset({
        name: "",
        description: "",
        location: "",
        restaurantEmployee: "",
      });
    };
  }, [props.initialData, reset]);

  async function handleAddRestaurant(data: Restaurant) {
    if (props.mode === OperationMode.add) {
      const response = await addRestaurant(data);
      setRefreshTrigger((curr) => curr + 1);
      return response;
    } else {
      const response = await updateRestaurant(data, props.initialData?.id as string);
      setRefreshTrigger((curr) => curr + 1);
      return response;
    };
  }
  const onSubmit: SubmitHandler<Restaurant> = async (data) => {
    const result = handleAddRestaurant(data);
    await toast.promise(result, {
      loading: 'Loading...',
      success: (data) => `${data}`,
      error: (err) => `${err.toString()}`,
    }
    );
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
              <ModalHeader className="flex flex-col gap-1">{props.mode === OperationMode.add ? "Ajouter" : "Editer"} un Restaurant</ModalHeader>
              <ModalBody>
                <form className='flex flex-col gap-1 items-start' >
                  <Input variant='bordered' color='secondary' type='text' label="Nom du Restau" {...register('name')} />
                  <Input variant='bordered' color='secondary' type='text' label="Emplacement" {...register('location')} />
                  <Textarea color='secondary' label="Description" placeholder="Entrer votre description" className="w-full" {...register('description')} />
                  <Select selectionMode='multiple' selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys} color='secondary' label="Employées" className="w-full" {...register('restaurantEmployee')}>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.firstName}>
                        {employee.firstName + employee.firstName + "--" + employee.role}
                      </SelectItem>
                    ))}
                  </Select>
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


export default AddRestaurantModal;