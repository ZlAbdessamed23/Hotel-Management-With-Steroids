import { ModalProps, Note, Task } from '@/app/types/types';
import { Modal, ModalContent, ModalBody, ModalFooter, Button, ModalHeader } from '@nextui-org/react'
import React from 'react'
import CardStyle4 from '../../cards/CardStyle4';
import NoteImage from "/public/NoteImage.svg";

export default function TodayNotesDisplayModal({
    props,
    data,
    setDisplayedItem,
    displayModalProps
}: {
    props: ModalProps;
    data: Note[];
    setDisplayedItem: React.Dispatch<React.SetStateAction<Note>>;
    displayModalProps: ModalProps;
}) {
    return (
        <Modal size='sm' isOpen={props.isOpen} onOpenChange={props.onOpenChange} className='font-segoe bg-slate-200 dark:bg-slate-900' hideCloseButton scrollBehavior='inside'>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Les notes d&apos;haujourd&apos;hui
                        </ModalHeader>
                        <ModalBody className='flex flex-col gap-4'>
                            {
                                data.map((item) => (
                                    <CardStyle4 DipslayIcon={NoteImage} key={item.id} infos={item} onOpen={displayModalProps.onOpen} setDisplayedItem={setDisplayedItem} />
                                ))
                            }
                        </ModalBody>
                        <ModalFooter className='flex items-center justify-between'>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Fermer
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
