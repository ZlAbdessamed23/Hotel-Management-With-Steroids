import { ModalProps } from '@/app/types/types'
import { deleteEventStage, deleteHotelEventStage, deleteHouseKeepingPlanification } from '@/app/utils/funcs';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react'
import React from 'react'
import toast from 'react-hot-toast';

export default function DeleteConfirmationModal({ dataType, props, eventId, itemId }: { dataType: "calendar" | "event" | "housekeeping", props: ModalProps, itemId: string, eventId?: string }) {

    async function handleDeleteItem() {
        switch (dataType) {
            case "event":
                const msg = await deleteEventStage(eventId as string, itemId);
                return msg;
            case "calendar":
                const message = await deleteHotelEventStage(itemId);
                return message;
            case "housekeeping":
                const mesg = await deleteHouseKeepingPlanification(itemId);
                return mesg;
        };
    };

    async function handleDelete() {
        const result = handleDeleteItem();
        await toast.promise(result, {
            loading: 'Loading...',
            success: (data) => `${data}`,
            error: (err) => `${err.toString()}`,
        }
        );
    };

    return (
        <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange} className="font-segoe">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Suppression
                        </ModalHeader>
                        <ModalBody>
                            Voulez-vous vraiment continuer l&apos;op&eacute;ration de la suppression?
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onClick={() => handleDelete()} >
                                Supprimer
                            </Button>
                            <Button color="warning" variant="light" onPress={onClose}>
                                annuler
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>)
}
