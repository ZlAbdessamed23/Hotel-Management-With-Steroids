import { Coach, ModalModeProps, ModalProps } from '@/app/types/types';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from '@nextui-org/react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { UserGender } from '@/app/types/constants';

const AddCoachModal : React.FC<ModalModeProps<Coach>> = (props) =>  {
  const Genders = Object.values(UserGender);

  const { register, handleSubmit , reset} = useForm<Coach>({
    defaultValues: props.initialData || {
      firstName: "",
      lastName: "",
      address: "",
      dateOfBirth: "",
      gender: UserGender.male,
      phoneNumber: "",
      email: "",
      nationality: "",
      speciality: "",
      workTime: "",
    }
  });

  useEffect(() => {
    if (props.initialData) {
      reset(props.initialData);
    }
  }, [props.initialData, reset]);

  const onSubmit = (data: Coach) => {
    console.log(data);
    
  };

  return (
    <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange} className='font-segoe'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Ajouter un Entraineur</ModalHeader>
            <ModalBody>
              <form className='flex flex-col gap-1 items-start' >
                <Input variant='bordered' color='secondary' type='text' label="Nom complet" {...register('firstName')} />
                <Input variant='bordered' color='secondary' type='text' label="Nom complet" {...register('lastName')} />
                <Input variant='bordered' color='secondary' type='text' label="Adresse" {...register('address')} />
                <Input variant='bordered' color='secondary' type='date' label="Date de naissance" {...register('dateOfBirth')} />
                <Input variant='bordered' color='secondary' type='text' label="Email" {...register('email')} />
                <Input variant='bordered' color='secondary' type='text' label="Téléphone" {...register('phoneNumber')} />
                <Input variant='bordered' color='secondary' type='text' label="Nationalité" {...register('nationality')} />
                <Input variant='bordered' color='secondary' type='text' label="Spécialité" {...register('speciality')} />
                <Select color='secondary' label="Sexe" className="w-full" {...register('gender')}>
                  {Genders.map((gender) => (
                    <SelectItem key={gender} value={gender}>
                      {gender}
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


export default AddCoachModal;