import { ModalProps, Note, Task } from '@/app/types/types';
import { Modal, ModalContent, ModalBody, ModalFooter, Button, ModalHeader } from '@nextui-org/react'
import React from 'react'

export default function TaskNoteDisplayModal({
  props,
  data1,
}: {
  props: ModalProps;
  data1: Task | Note;
}) {
  return (
    <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange} className='font-segoe' hideCloseButton scrollBehavior='inside'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {data1.title}
            </ModalHeader>
            <ModalBody className='flex flex-col gap-4'>
              {
                data1.description
              }
            </ModalBody>
            <ModalFooter className='flex items-center justify-between'>
              <p className='text-base font-light text-gray-400 text-opacity-90'>{data1.deadline.toString()}</p>
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
