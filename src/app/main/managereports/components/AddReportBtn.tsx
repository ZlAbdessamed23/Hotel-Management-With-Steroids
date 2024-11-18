"use client"

import { Button, useDisclosure } from '@nextui-org/react'
import React from 'react'
import { FaPlus } from 'react-icons/fa'
import AddReportModal from '../../components/modals/forms/AddReportModal'

export default function AddReportBtn() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <section className='flex items-center justify-end mb-8'>
      <Button className='bg-secondary text-white' endContent={<FaPlus className='size-5' />} onClick={onOpen}>Ajouter un Rapport</Button>
      <AddReportModal isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange} />
    </section>
  )
}
