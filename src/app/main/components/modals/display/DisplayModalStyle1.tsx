import { ModalProps } from '@/app/types/types'
import { Modal, ModalContent, ModalHeader, ModalBody, Divider, ModalFooter, Button } from '@nextui-org/react'
import React from 'react'



export default function DisplayModalStyle1<T1 extends object, T2 extends object>({
  props,
  data1,
  data2,
  title1,
  title2
}: {
  props: ModalProps;
  data1: T1;
  data2: T2;
  title1: string;
  title2: string;
}) {
  return (
    <Modal size='3xl' isOpen={props.isOpen} onOpenChange={props.onOpenChange} className='font-segoe' hideCloseButton>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-row items-center justify-between w-3/4">
              <span>{title1}</span>
              <span>{title2}</span>
            </ModalHeader>
            <ModalBody className='grid grid-cols-[48.5%,1%,49.5%]'>
              <div className='flex flex-col gap-4'>
                <span className=' text-2xl font-semibold'>{title1}</span>

                {Object.entries(data1).map(([key, value]) => (
                  <section key={key} className='flex flex-row gap-3 items-center'>
                    <span className='text-secondary'>{key}:</span>
                    <span className=' w-60 h-6 overflow-hidden text-ellipsis'>{String(value)}</span>
                  </section>
                ))}
              </div>
              <Divider orientation='vertical' className='bg-secondary' />
              <div className='flex flex-col gap-4'>
              <span className=' text-2xl font-semibold'>{title2}</span>
                {Object.entries(data2).map(([key, value]) => (
                  <section key={key} className='flex flex-row gap-3 items-center'>
                    <span className='text-secondary'>{key}:</span>
                    <span className=' w-60 h-6 overflow-hidden text-ellipsis'>{String(value)}</span>
                  </section>
                ))}
              </div>
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