"use client"


import { DaysOfWeek, Departements, EmployeeState, OperationMode, UserGender, UserRole } from '@/app/types/constants';
import { ModalModeProps, RegisteredEmployee } from '@/app/types/types';
import { addEmployee, updateEmployee } from '@/app/utils/funcs';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Selection, Select, SelectItem } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const AddEmployeeModal: React.FC<ModalModeProps<RegisteredEmployee>> = (props) => {
  const WeekDays = Object.values(DaysOfWeek);
  const Genders = Object.values(UserGender);
  const Roles = Object.values(UserRole);
  const States = Object.values(EmployeeState);
  const Sections = Object.values(Departements);
  const router = useRouter();

  const [selectedRoles, setSelectedRoles] = useState<Selection>( props.initialData?.role ? new Set([...(props.initialData.role as UserRole[])]) : new Set([]));
  const [selectedDepartements, setSelectedDepartements] = useState<Selection>(props.initialData?.departement ? new Set([...(props.initialData.departement as Departements[])]) : new Set([]));
  const [selectedWorkingDays, setSelectedWorkingDays] = useState<Selection>(props.initialData?.workingDays ? new Set([...(props.initialData.workingDays as DaysOfWeek[])]) : new Set([]));

  const { register, handleSubmit, reset , setValue } = useForm<RegisteredEmployee>({
    defaultValues: props.initialData || {
      firstName: "",
      lastName: "",
      address: "",
      dateOfBirth: "",
      gender: UserGender.male,
      phoneNumber: "",
      email: "",
      departement: [],
      role: [],
      workingDays: "",
      nationality: "",
      state: EmployeeState.working,
    }
  });

  async function handleAddEmployee(employee: RegisteredEmployee) {
    if (props.mode === OperationMode.add) {
      const response = await addEmployee(employee);
      router.refresh();
      return response;
    }
    else {
      const data : RegisteredEmployee = {...employee , role : (Array.from(selectedRoles) as UserRole[]).join(",") , departement : (Array.from(selectedDepartements) as Departements[]).join(",") , workingDays : (Array.from(selectedWorkingDays) as DaysOfWeek[]).join(",")};
      const response = await updateEmployee(props.initialData?.id as string, data);
      router.refresh();
      return response;
    };
  };

  const onSubmit: SubmitHandler<RegisteredEmployee> = async (data) => {
    const result = handleAddEmployee(data);
    await toast.promise(result, {
      loading: 'Loading...',
      success: (data) => `${data}`,
      error: (err) => `${err.toString()}`,
    }
    );
  };

  useEffect(() => {

    if(props.mode === OperationMode.update && props.initialData){
      reset({...props.initialData , dateOfBirth : props.initialData?.dateOfBirth ? new Date(props.initialData.dateOfBirth).toISOString().split('T')[0] : ""} , {keepDefaultValues : false});
    }
    else{
      reset({
        firstName: "",
        lastName: "",
        address: "",
        dateOfBirth: "",
        gender: UserGender.male,
        phoneNumber: "",
        email: "",
        departement: [],
        role: [],
        workingDays: "",
        nationality: "",
        state: EmployeeState.working,
      })
    };

    setTimeout(() => {
      setSelectedRoles(props.initialData?.role ? new Set([...((props.initialData.role as UserRole[]).join(",").replace(/_/g, " ").split(","))]) : new Set([]));
      setSelectedDepartements(props.initialData?.departement ? new Set([...(props.initialData.departement as Departements[])]) : new Set([]));
      setSelectedWorkingDays(props.initialData?.workingDays ? new Set([...(props.initialData.workingDays as DaysOfWeek[])]) : new Set([]));
    },0);
  },[props.initialData , props.mode])

  return (
    <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange} className='font-segoe z-50' scrollBehavior="inside">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Ajouter un Employé</ModalHeader>
            <ModalBody>
              <form className='flex flex-col gap-1 items-start' >
                <Input variant='bordered' color='secondary' type='text' label="Nom" {...register('firstName')} />
                <Input variant='bordered' color='secondary' type='text' label="Prénom" {...register('lastName')} />
                <Input variant='bordered' color='secondary' type='text' label="Adresse" {...register('address')} />
                <Input variant='bordered' color='secondary' type='date' label="Date de naissance" {...register('dateOfBirth')} />
                <Input variant='bordered' color='secondary' type='text' label="Email" {...register('email')} />
                <Input variant='bordered' color='secondary' type='text' label="Mot de Passse" {...register('password')} />
                <Input variant='bordered' color='secondary' type='text' label="Téléphone" {...register('phoneNumber')} />
                <Input variant='bordered' color='secondary' type='text' label="Nationalité" {...register('nationality')} />
                <Select color='secondary' label="Sexe" className="w-full" {...register('gender')}>
                  {Genders.map((gender) => (
                    <SelectItem key={gender} value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </Select>
                <Select selectedKeys={selectedDepartements} onSelectionChange={setSelectedDepartements} selectionMode='multiple' color='secondary' label="Département" className="w-full" {...register('departement')}>
                  {Sections.map((departement) => (
                    <SelectItem key={departement} value={departement}>
                      {departement}
                    </SelectItem>
                  ))}
                </Select>
                <Select selectedKeys={selectedRoles} onSelectionChange={setSelectedRoles} selectionMode='multiple' color='secondary' label="Rôle" className="w-full" {...register('role')}>
                  {Roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </Select>
                <Select selectedKeys={selectedWorkingDays} onSelectionChange={setSelectedWorkingDays} selectionMode='multiple' color='secondary' label="Les jours de travail" className="w-full" {...register('workingDays')}>
                  {WeekDays.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </Select>
                <Select color='secondary' label="Status" className="w-full" {...register('state')}>
                  {States.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
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
  );
}

export default AddEmployeeModal;
