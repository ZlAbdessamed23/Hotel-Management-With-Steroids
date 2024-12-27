"use client"

import { GymContextProvider } from '@/app/main/components/GymContextProvider';
import CardStyle3 from '@/app/main/components/cards/CardStyle3';
import CardStyle9 from '@/app/main/components/cards/CardStyle9';

import AddGymClientModal from '@/app/main/components/modals/forms/AddGymClientModal';
import AddGymModal from '@/app/main/components/modals/forms/AddGymModal';
import GenericDataGrid, { DataGridItem } from '@/app/main/components/other/GenericDataGrid';
import GenericDisplayTable from '@/app/main/components/other/GenericDisplayTable';
import { ClientState, OperationMode, UserGender } from '@/app/types/constants';
import { Coach, ModalModeProps, SportHall, SportHallClient, ThirdCardItemType } from '@/app/types/types';
import { deleteGym, getAllGymCoaches, getGym, getGymMembers } from '@/app/utils/funcs';
import { Button, ChipProps, Tab, Tabs, useDisclosure } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { FaPerson } from 'react-icons/fa6';



export default function Gym({ params }: {
  params: { id: string }
}) {
  const router = useRouter();
  const [gym, setGym] = useState<SportHall>();
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [coachesCount, setCoachesCount] = useState<number>(0);
  const [currentGymCoaches, setCurrentGymCoaches] = useState<Coach[]>([]);
  const [members, setMembers] = useState<SportHallClient[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const columns = [
    { name: "Nom Complet", uid: "clientName" },
    { name: "PHONE NUMBER", uid: "phoneNumber" },
    { name: "Email", uid: "email" },
    { name: "Numéro de la Carte Nationale", uid: "identittyCardNumber" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const statusColorMap: Record<ClientState, ChipProps["color"]> = {
    [ClientState.pending]: "warning",
    [ClientState.absent]: "danger",
    [ClientState.coming]: "success",
  };
  async function getGymById() {
    const data = await getGym(params.id);
    setGym(data.sportsFacility);
  }

  async function getCoaches() {
    const data = await getAllGymCoaches(params.id);
    setCoaches(data.coaches.map((coach) => coach.employee));
    setCoachesCount(data.SportFacilityCoachesCount);
    setCurrentGymCoaches(data.coaches.filter((coach) => coach.sportFacilityId === params.id).map((entr) => entr.employee));
  };

  async function getMembers() {
    const data = await getGymMembers(params.id);
    setMembers(data.sportsFacilitiesMember);
  };

  useEffect(() => {
    getGymById();
    getMembers();
  }, [refreshTrigger]);

  useEffect(() => {
    getCoaches();
  }, []);

  async function handleDeleteGym() {
    try{
      const res = await deleteGym(gym?.id as string);
      if(res){
        setTimeout(() => {
          router.push("/main/employee/reception/managegyms");
        },1000);
      }
      return res;
    }
    catch(err : any){
      throw new Error(err);
    };
  };

  async function handleDelete() {
    const result = handleDeleteGym();
    await toast.promise(result, {
      loading: 'Loading...',
      success: (data) => `${data}`,
      error: (err) => `${err.toString()}`,
    }
    );
  };

  const maleMembers = members.filter((member) => member.gender === UserGender.male).length;
  const item: ThirdCardItemType = {
    icon: FaPerson,
    title: "Clients",
    subject: "clients",
    subTitle: "male",
    currentValue: members.length,
    pourcentage: (maleMembers * 100 / members.length) || 0,
  };

  const item2: ThirdCardItemType = {
    icon: FaPerson,
    title: "Entraineurs",
    subject: "entraineurs",
    subTitle: "dans cette salle",
    currentValue: coaches.length,
    pourcentage: currentGymCoaches.length * 100 / coaches.length || 0,
  };

  const item3: ThirdCardItemType = {
    icon: FaPerson,
    title: "Clients",
    subject: "clients",
    subTitle: "par rapport au max",
    currentValue: members.length || 0,
    pourcentage: (members.length || 0) * 100 / (gym?.capacity || 1),
  };

  const fields = {
    coach: currentGymCoaches[0]?.firstName || "",
    price: gym?.price?.toString() || "",
    capacity: gym?.capacity?.toString() || "",
  };

  const UpdateGymModalProps = useDisclosure();

  useEffect(() => {
    console.log(coaches);
  },[coaches]);

  return (
    <div className='flex flex-col gap-8'>
      <section className='grid grid-rows-3 lg:grid-rows-none gap-4 lg:grid-cols-2 xl:grid-cols-3 items-center mb-2 w-full pl-10'>
        <CardStyle3 infos={item} />
        <CardStyle3 infos={item2} />
        <CardStyle3 infos={item3} />
      </section>
      <section className='flex items-center justify-end xl:mr-14'>
        <div className='flex items-center justify-between w-96'>
          <Button color='danger' onClick={handleDelete}>Supprimer la salle</Button>
          <Button color='primary' onClick={UpdateGymModalProps.onOpen}>Mise à jour de salle</Button>
        </div>
        <AddGymModal isOpen={UpdateGymModalProps.isOpen} mode={OperationMode.update} onOpen={UpdateGymModalProps.onOpen} onOpenChange={UpdateGymModalProps.onOpenChange} initialData={gym} />
      </section>
      <section className='grid grid-rows-2 xl:grid-rows-none xl:grid-cols-[35%,60%] gap-4 w-full'>
        <div className='flex flex-col gap-8'>
          <CardStyle9 title={gym?.name || "Salle de Musculation"} fields={fields} />
        </div>
        <div className='w-[25rem] overflow-auto md:w-full'>
          <Tabs aria-label="Options" className='w-[99%]' classNames={{
            base: "w-full",
            tabList: "w-[99%] flex flex-row items-center justify-between",
            tab: "w-[10rem]",
          }}>
            <Tab key="Clients" title="Clients">
              <div className='w-[99%]'>
                <GymContextProvider setRefreshTrigger={setRefreshTrigger} gymId={params.id} >
                  <GenericDataGrid Add_Edit_Modal={AddGymClientModal as React.FC<ModalModeProps<DataGridItem>>} columns={columns} items={members} statusColorMap={statusColorMap} comingDataType={'gymClient'} />
                </GymContextProvider>
              </div>
            </Tab>
            <Tab key="Coaches" title="Entraineurs">
              <div className='w-[99%]'>
                <GenericDisplayTable columns={columns} data={coaches} />
              </div>
            </Tab>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
