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
import toast from 'react-hot-toast';
import { useRefreshMenuContext } from '../../RefreshTriggerContext';

export default function UpdateReservationState({
    props,
    data,
}: {
    props: ModalProps;
    data: Pending[];
}) {
    const [selectedKeys, setSelectedKeys] = useState<string | null>(null);
    const { setFetchTrigger } = useRefreshMenuContext();

    async function changeStatus() {
        const result = handleChangeState();
        await toast.promise(result, {
            loading: 'Loading...',
            success: (data) => `${data}`,
            error: (err) => `${err.toString()}`,
        }
        );
    };

    async function deleteRes() {
        const result = handleDeleteReservation();
        await toast.promise(result, {
            loading: 'Loading...',
            success: (data) => `${data}`,
            error: (err) => `${err.toString()}`,
        }
        );
    };

    async function handleChangeState() {
        if (selectedKeys) {
            const [clientId, reservationId] = selectedKeys.split(',');
            const res = await updateReservationState(clientId, reservationId);
            setFetchTrigger((curr) => curr + 1);
            return res.message;
        };
    };

    async function handleDeleteReservation() {
        if (selectedKeys) {
            const [clientId, reservationId] = selectedKeys.split(',');
            const res = await deletePendingReservation(clientId, reservationId);
            setFetchTrigger((curr) => curr + 1);
            return res.message;
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
                            <Button color="warning" variant="light" onPress={deleteRes}>
                                Supprimer la Reservation
                            </Button>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Fermer
                            </Button>
                            <Button
                                color="primary"
                                variant="shadow"
                                onClick={changeStatus}
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
