import { ModalProps } from '@/app/types/types';
import { TranslateObjKeysFromEngToFr } from '@/app/utils/translation';
import { Modal, ModalContent, ModalBody, ModalFooter, Button, ModalHeader } from '@nextui-org/react'
import React from 'react'

export default function DisplayModalStyle2<T1 extends object>({
  props,
  data1,
  title1,
}: {
  props: ModalProps;
  data1: T1;
  title1: string;
}) {
  return (
    <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange} className='font-segoe' hideCloseButton>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {title1}
            </ModalHeader>
            <ModalBody className='flex flex-col gap-4'>
              {Object.entries(data1).map(([key, value]) => (
                !(key.includes("id") || key.includes("Id")) && <section key={key} className='flex flex-row items-center gap-4'>
                  <span className='text-secondary  font-semibold'>{TranslateObjKeysFromEngToFr(key)}:</span>
                  <span className='w-60 truncate text-black dark:text-white'>{String(value)}</span>
                </section>
              ))}
            </ModalBody>
            <ModalFooter>
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
