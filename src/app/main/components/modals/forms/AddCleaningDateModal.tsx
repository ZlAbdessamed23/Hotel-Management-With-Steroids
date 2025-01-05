"use client";

import { CleaningType, ModalProps } from '@/app/types/types';
import { addCleaningDate } from '@/app/utils/funcs';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useRefreshMenuContext } from '../../RefreshTriggerContext';


const AddCleaningDateModal: React.FC<{ props: ModalProps }> = ({ props }) => {
    const { setFetchTrigger } = useRefreshMenuContext();
    const { register, handleSubmit, reset } = useForm<CleaningType>({
        defaultValues: {
            title: "",
            description: "",
            date: "",
        },
    });

    const handleAddCleaningData = async (data: CleaningType) => {
        const res = await addCleaningDate(data);
        setFetchTrigger((curr) => curr + 1);
        return res;
    };

    const onSubmit: SubmitHandler<CleaningType> = async (data) => {
        const result = handleAddCleaningData(data);
        await toast.promise(result, {
            loading: 'Loading...',
            success: (message) => `${message}`,
            error: (err) => `${err.toString()}`,
        });
    };

    return (
        <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange} className="font-segoe">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Add Cleaning Schedule</ModalHeader>
                        <ModalBody>
                            <form className="flex flex-col gap-1 items-start">
                                <Input
                                    variant="bordered"
                                    color="secondary"
                                    type="text"
                                    label="Title"
                                    {...register('title')}
                                />
                                <Input
                                    variant="bordered"
                                    color="secondary"
                                    type="text"
                                    label="Description"
                                    {...register('description')}
                                />
                                <Input
                                    variant="bordered"
                                    color="secondary"
                                    type="date"
                                    label="Date"
                                    {...register('date')}
                                />
                            </form>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                            <Button color="primary" type="submit" onClick={handleSubmit(onSubmit)}>
                                Save
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default AddCleaningDateModal;
