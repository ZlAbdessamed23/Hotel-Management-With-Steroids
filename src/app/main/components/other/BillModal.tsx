import { Client, Hotel, HotelInfos, ModalProps, Reservation } from '@/app/types/types'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from '@nextui-org/react'
import React, { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print';
import { GiPositionMarker } from "react-icons/gi";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import BillTable from './BillTable';
import AddCustomBillModal from './AddCustomBillModal';
import { deleteReservation, getHotelForBill } from '@/app/utils/funcs';
import { useRouter } from 'next/navigation';


const generateBillId = () => {
    const today = new Date().toISOString().split('T')[0];
    const storedDate = localStorage.getItem('lastBillDate');
    const currentCounter = localStorage.getItem('billCounter');

    if (storedDate !== today) {
        localStorage.setItem('lastBillDate', today);
        localStorage.setItem('billCounter', '0');
        localStorage.setItem('currentBillId', '0000');
        return '0000';
    }

    if (!currentCounter) {
        localStorage.setItem('billCounter', '0');
        localStorage.setItem('currentBillId', '0000');
        return '0000';
    }

    const lastDisplayedId = localStorage.getItem('currentBillId') || '0000';
    return lastDisplayedId;
};

const incrementBillCounter = () => {
    const counter = parseInt(localStorage.getItem('billCounter') || '0');
    const newCounter = counter + 1;
    const newId = newCounter.toString().padStart(4, '0');
    localStorage.setItem('billCounter', newCounter.toString());
    localStorage.setItem('currentBillId', newId);
};



export default function BillModal({ resId, props, infos, reservation }: { resId: string | undefined, props: ModalProps, infos: Client, reservation: Reservation }) {
    const router = useRouter();
    const CustomModal = useDisclosure();
    const contentRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        contentRef: contentRef,
        pageStyle: `
        @media print {
            body * {
                -webkit-print-color-adjust: exact !important;
            }
            body * div {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            @page {
                size: auto;
                margin: 20mm;
            }
        }
    `,
        onAfterPrint: () => {
            deleteReservation(resId as string).then(() => router.push("/main/employee/reception/manageclients"));
            incrementBillCounter();
        }
    });

    const [hotelInfos , setHotelInfos] = useState<HotelInfos>({
        hotelPhoneNumber : "",
        country : "",
        hotelAddress : "",
        hotelEmail : "",
        hotelName : "",
    });

    const [billId, setBillId] = useState<string>('0000');
    const [items, setItems] = useState<Array<{ quantity: number, description: string, unitPrice: number }>>([{
        description : `nuit dans la chambre ${reservation.roomType + " " + reservation.roomNumber}`,
        quantity : reservation.totalDays,
        unitPrice : reservation.totalPrice,
    }]);

    async function getHotelInfos() {
        const data = await getHotelForBill();
        setHotelInfos(data.Hotel);
    };

    useEffect(() => {
        const generatedId = generateBillId();
        setBillId(generatedId);
        getHotelInfos();
    }, [props.isOpen]);

    return (
        <Modal scrollBehavior='outside' size='5xl' isOpen={props.isOpen} onOpenChange={props.onOpenChange} className='font-segoe'>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Facture</ModalHeader>
                        <ModalBody >
                            <div ref={contentRef} className='flex flex-col gap-8'>
                                <h1 className='text-5xl font-bold text-center text-primary'>{hotelInfos.hotelName}</h1>
                                <div>
                                    <section className='flex items-center justify-between mb-4'>
                                        <span className='flex justify-start items-center gap-2 w-1/2'>
                                            <GiPositionMarker className='size-6 text-secondary' />
                                            {hotelInfos.hotelAddress}
                                        </span>
                                        <span className='flex justify-end items-center gap-2 w-1/2'>
                                            <FaPhoneAlt className='size-6 text-secondary' />
                                            {hotelInfos.hotelPhoneNumber}
                                        </span>
                                    </section>
                                    <section className='w-full'>
                                        <span className='flex items-center justify-center gap-2'>
                                            <MdEmail className='size-6 text-secondary' />
                                            {hotelInfos.hotelEmail}
                                        </span>
                                    </section>
                                </div>
                                <div className='w-full h-2 bg-primary-500 rounded-full'></div>
                                <div>
                                    <section className='flex items-start'>
                                        <div className='w-1/2 flex flex-col gap-2'>
                                            <p className='text-xl text-secondary font-medium'>payé par</p>
                                            <section className='ml-2'>
                                                <p className='text-lg font-normal'>{infos.fullName}</p>
                                                <p className='text-lg font-normal'>{infos.phoneNumber}</p>
                                                <p className='text-lg font-normal'>{infos?.email || ""}</p>
                                            </section>
                                        </div>
                                        <div className='w-1/2 flex justify-end'>
                                            <h2 className='text-4xl font-semibold text-primary'>Facture</h2>
                                        </div>
                                    </section>
                                    <section></section>
                                </div>
                                <div className='flex'>
                                    <div className='w-1/2'>
                                        <p className='text-xl text-secondary font-medium'>Détailles</p>
                                        <section className='ml-2 text-lg'>
                                            <div>
                                                <span className='font-semibold'>Chambre: </span>
                                                <span>{reservation.roomType + " " + reservation.roomNumber}</span>
                                            </div>
                                            <div>
                                                <span className='font-semibold'>Entrée: </span>
                                                <span>{new Date(reservation.startDate).toISOString().split('T')[0]}</span>
                                            </div>
                                            <div>
                                                <span className='font-semibold'>Sortie: </span>
                                                <span>{new Date(reservation.endDate).toISOString().split('T')[0]}</span>
                                            </div>

                                        </section>
                                    </div>
                                    <div className='flex flex-col justify-end items-end w-full pb-2'>
                                        <div className='flex justify-end w-full'>
                                            <span className='font-semibold'>Date de Facture: </span>
                                            <span>{new Date().toISOString().split('T')[0]}</span>
                                        </div>
                                        <div className='flex justify-end w-full'>
                                            <span className='font-semibold'>Facture Id:</span>
                                            <span>{billId}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <BillTable items={items} />
                                </div>
                            </div>
                            <AddCustomBillModal setItems={setItems} props={CustomModal} />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" variant="shadow" onPress={CustomModal.onOpen}>
                                Ajouter Quelque Chose 
                            </Button>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Fermer
                            </Button>
                            <Button color="primary" variant='shadow' onClick={() => handlePrint()}>
                                Sauvegarder
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
