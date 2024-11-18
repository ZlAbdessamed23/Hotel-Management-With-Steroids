import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea } from '@nextui-org/react'
import React from 'react'
import { BillTableType, ModalProps } from '@/app/types/types'
import { SubmitHandler, useForm } from 'react-hook-form';

export default function AddCustomBillModal({ props, setItems }: {
    props: ModalProps, setItems: React.Dispatch<React.SetStateAction<{
        quantity: number;
        description: string;
        unitPrice: number;
    }[]>>
}) {

    const { register, handleSubmit, reset } = useForm<BillTableType>({
        defaultValues: {
            unitPrice: 0,
            quantity: 0,
            description: "",
        },
    });
    const onSubmit: SubmitHandler<BillTableType> = async (data) => {
        setItems((curr) => [...curr, data]);
        reset({
            unitPrice: 0,
            quantity: 0,
            description: "",
        });
    };

    return (
        <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange} className='font-segoe'>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Facture</ModalHeader>
                        <ModalBody >
                            <form className='flex flex-col gap-2'>
                                <Textarea color='secondary' label="Description" placeholder="Entrer la description du chambre" className="w-full" {...register('description')} />
                                <Input
                                    variant='bordered'
                                    color='secondary'
                                    type='text'
                                    {...register('quantity')}
                                    label="Quantité"
                                />
                                <Input
                                    variant='bordered'
                                    color='secondary'
                                    type='text'
                                    {...register('unitPrice')}
                                    label="Prix Unitaire"
                                />
                            </form>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Fermer
                            </Button>
                            <Button color="primary" variant='shadow' type='submit' onClick={handleSubmit(onSubmit)}>
                                Sauvegarder
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>)
}
