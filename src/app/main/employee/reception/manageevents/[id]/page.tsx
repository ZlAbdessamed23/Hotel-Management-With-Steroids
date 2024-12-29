"use client"

import CardStyle3 from '@/app/main/components/cards/CardStyle3';
import CardStyle9 from '@/app/main/components/cards/CardStyle9';
import EventGanttChart from '@/app/main/components/charts/EventGanttChart';
import CustomCalendar from '@/app/main/components/custom/CustomCalendar';
import AddEventInvitedModal from '@/app/main/components/modals/forms/AddEventInvitedModal';
import { EventGuestsType, OperationMode, UserGender } from '@/app/types/constants';
import { ThirdCardItemType, EventStage, ModalModeProps, Event as FrontEvent, DataType, EventInvited } from '@/app/types/types';
import { useDisclosure, Tabs, Tab, Button } from '@nextui-org/react';
import React, { useEffect, useState } from 'react'
import { FaPerson, FaPlus } from 'react-icons/fa6';
import { ModalProps } from '@/app/types/types';
import AddOrganizerModal from '@/app/main/components/modals/forms/AddOrganizerModal';
import ClientsDataGrid from '@/app/main/components/other/ClientsDataGrid';
import { deleteEvent, getEvent, getEventGuests, getEventStages } from '@/app/utils/funcs';
import AddEventPlanStageModal from '@/app/main/components/modals/forms/AddEventPlanStageModal';
import { EventContextProvider } from '@/app/main/components/EventContextProvider';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import AddEventModal from '@/app/main/components/modals/forms/AddEventModal';

export default function Event({ params }: {
  params: { id: string }
}) {
  const router = useRouter();
  const [event, setEvent] = useState<FrontEvent>();
  const [eventStages, setEventStages] = useState<EventStage[]>();
  const [guests, setGuests] = useState<EventInvited[]>([]);
  const [stagesRefreshTrigger, setStagesRefreshTrigger] = useState<number>(0);
  const [ClientsRefreshTrigger, setClientsRefreshTrigger] = useState<number>(0);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const props: ModalProps = { isOpen, onOpen, onOpenChange };

  const nowLagos = new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' });
  const nowLagosDate = new Date(nowLagos);

  async function getEventById() {
    const data = await getEvent(params.id);
    setEvent(data.Event);
  };

  async function getAllEventStages() {
    const data = await getEventStages(params.id);
    setEventStages(data.EventSeances);
  };

  async function getAllEventGuests() {
    const data = await getEventGuests(params.id);
    setGuests(data.Attendues);
  };

  useEffect(() => {
    getAllEventStages();

  }, [stagesRefreshTrigger]);

  useEffect(() => {
    getEventById();
    getAllEventGuests();
  }, [ClientsRefreshTrigger]);

  const startDate = new Date(event?.startDate as string);
  const endDate = new Date(event?.endDate as string);

  const fields = {
    chef: event?.leader || "",
    commence: event?.startDate.toString() || "",
    finit: event?.endDate.toString() || "",
  };

  const parseDateTime = (dateTimeString: string): Date => {
    const cleanDateTime = dateTimeString.split('[')[0];
    return new Date(cleanDateTime);
  };

  const doneStages = eventStages?.filter((stage) =>
    stage.end && parseDateTime(stage.end.toString()).getTime() < nowLagosDate.getTime()
  ) || [];
  const attendus = guests?.filter((guest) => guest.type === EventGuestsType.normal) || [];
  const organisers = guests?.filter((guest) => guest.type === EventGuestsType.organiser) || [];
  const maleOrganisers = organisers.filter((organiser) => organiser.gender === UserGender.male) || [];
  const item: ThirdCardItemType = {
    icon: FaPerson,
    title: "Invités",
    subject: "invités attendus",
    subTitle: "venu",
    currentValue: Number(event?.guests) || 0,
    pourcentage: (attendus.length || 0) * 100 / (event?.guests || 1),
  };

  const item2: ThirdCardItemType = {
    icon: FaPerson,
    title: "Organisateurs",
    subject: "organisateurs",
    subTitle: "male",
    currentValue: organisers.length || 0,
    pourcentage: maleOrganisers.length || 0,
  };

  const item3: ThirdCardItemType = {
    icon: FaPerson,
    title: "Etapes",
    subject: "Etapes finis",
    subTitle: "finis",
    currentValue: doneStages.length || 0,
    pourcentage: (doneStages.length * 100 / (eventStages?.length || 0)) || 0,
  };

  async function handleDeleteEvent() {
    try{
      const res = await deleteEvent(event?.id as string);
      if(res){
        setTimeout(() => {
          router.push("/main/employee/reception/manageevents");
        },1000);
      }
      return res;
    }
    catch(err : any){
      throw new Error(err);
    };
  };

  async function handleDelete() {
    const result = handleDeleteEvent();
    await toast.promise(result, {
      loading: 'Loading...',
      success: (data) => `${data}`,
      error: (err) => `${err.toString()}`,
    }
    );
  };

  const UpdateEventModalProps = useDisclosure();


  return (
    <div className='flex flex-col gap-12'>
      <section className='grid grid-rows-3 lg:grid-rows-none gap-4 lg:grid-cols-2 xl:grid-cols-3 items-center mb-12 w-full pl-10'>
        <CardStyle3 infos={item} />
        <CardStyle3 infos={item2} />
        <CardStyle3 infos={item3} />
      </section>
      <section className='flex items-center justify-end'>
        <div className='flex items-center justify-between w-96'>
          <Button color='danger' onClick={handleDelete}>Supprimer l&apos;evennement</Button>
          <Button color='success' onClick={UpdateEventModalProps.onOpen}>Mise à jour l&apos;evennement</Button>
        </div>
        <AddEventModal isOpen={UpdateEventModalProps.isOpen} mode={OperationMode.update} onOpen={UpdateEventModalProps.onOpen} onOpenChange={UpdateEventModalProps.onOpenChange} initialData={event}  />
      </section>
      <section className='grid grid-rows-2 xl:grid-rows-none xl:grid-cols-[35%,60%] gap-4 w-full'>
        <div className='flex flex-col items-start gap-8'>
          <CardStyle9 title={event?.name || "Evenement"} fields={fields} />
          <CustomCalendar startDate={startDate} endDate={endDate} />
        </div>
        <div className='w-[25rem] overflow-auto md:w-full lg:pl-8'>
          <EventContextProvider clientsRefreshTrigger={ClientsRefreshTrigger} setClientsRefreshTrigger={setClientsRefreshTrigger} stagesRefreshTrigger={stagesRefreshTrigger} setStagesRefreshTrigger={setStagesRefreshTrigger} eventId={params.id}>
            <Tabs aria-label="Options" className='w-[99%]' classNames={{
              base: "w-full",
              tabList: "w-[99%] flex flex-row items-center justify-between",
              tab: "w-[10rem]",
            }}>
              <Tab key="Plan" title="Plan">
                <section className='flex justify-end mb-4'>
                  <Button variant="shadow" color="secondary" endContent={<FaPlus className="size-4" />} onClick={props.onOpen}>Ajouter un nouveau</Button>
                  <AddEventPlanStageModal type='event' props={props} />
                </section>
                <EventGanttChart events={eventStages || []} />
              </Tab>
              <Tab key="WaitingList" title="Attendus">
                <div className='max-w-[45rem]'>
                  <ClientsDataGrid Add_Edit_Modal={AddEventInvitedModal as React.FC<ModalModeProps<DataType>>} data={attendus} type='eventInvited' />
                </div>
              </Tab>
              <Tab key="Organisers" title="Organisateurs">
                <div className='max-w-[45rem]'>
                  <ClientsDataGrid Add_Edit_Modal={AddOrganizerModal as React.FC<ModalModeProps<DataType>>} data={organisers} type='eventWorker' />
                </div>
              </Tab>
            </Tabs>
          </EventContextProvider>
        </div>
      </section>
    </div>
  )
}
