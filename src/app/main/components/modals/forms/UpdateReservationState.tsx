import { ModalProps, Pending } from '@/app/types/types';
import { deletePendingReservation, updateReservationState } from '@/app/utils/funcs';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Select,
    SelectItem,
    ModalFooter,
    Button,
} from '@nextui-org/react';
import React, { useEffect, useState } from 'react';

export default function UpdateReservationState({
    props,
    data,
}: {
    props: ModalProps;
    data: Pending[];
}) {
    const [selectedKeys, setSelectedKeys] = useState<string | null>(null);

    async function handleChangeState() {
        if (selectedKeys) {
            const [clientId, reservationId] = selectedKeys.split(',');
            await updateReservationState(clientId, reservationId);
        };
    };

    async function handleDeleteReservation() {
        if (selectedKeys) {
            const [clientId, reservationId] = selectedKeys.split(',');
            await deletePendingReservation(clientId, reservationId);
        };   
    };

    return (
        <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange} className="font-segoe">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Ajouter une Transaction
                        </ModalHeader>
                        <ModalBody>
                            <form className="flex flex-col gap-1 items-start">
                                <Select
                                    color="secondary"
                                    label="Type de Transaction"
                                    className="w-full"
                                    onChange={(value) => setSelectedKeys(value.target.value)}
                                >
                                    {data.map((infos) => (
                                        <SelectItem
                                            key={`${infos.id},${infos.reservationId}`}
                                        >
                                            {`${infos.fullName} ${infos.roomType} ${infos.roomNumber}`}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </form>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="warning" variant="light" onPress={() => handleDeleteReservation()}>
                                Supprimer la Reservation
                            </Button>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Fermer
                            </Button>
                            <Button
                                color="primary"
                                variant="shadow"
                                onClick={() => handleChangeState()}
                            >
                                Mise à jour au réservé
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
