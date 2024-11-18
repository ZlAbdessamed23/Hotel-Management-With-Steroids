"use client"

import { GymContextProvider} from '@/app/main/components/GymContextProvider';
import CardStyle3 from '@/app/main/components/cards/CardStyle3';
import CardStyle9 from '@/app/main/components/cards/CardStyle9';

import AddGymClientModal from '@/app/main/components/modals/forms/AddGymClientModal';
import GenericDataGrid, { DataGridItem } from '@/app/main/components/other/GenericDataGrid';
import GenericDisplayTable from '@/app/main/components/other/GenericDisplayTable';
import { ClientState, UserGender } from '@/app/types/constants';
import { Coach, ModalModeProps,SportHall,SportHallClient,ThirdCardItemType } from '@/app/types/types';
import { getAllGymCoaches, getGym, getGymMembers } from '@/app/utils/funcs';
import { ChipProps, Tab, Tabs } from '@nextui-org/react';
import React, { useEffect, useState } from 'react'
import { FaPerson } from 'react-icons/fa6';

export default function Gym({params} : {
  params : {id : string}
}) 

{

  const [gym , setGym] = useState<SportHall>();
  const [coaches , setCoaches] = useState<Coach[]>([]);
  const [coachesCount , setCoachesCount] = useState<number>(0);
  const [members , setMembers] = useState<SportHallClient[]>([]);
  const [refreshTrigger , setRefreshTrigger] = useState(0);
  const columns = [
    {name: "Nom Complet", uid: "clientName"},
    {name: "PHONE NUMBER", uid: "phoneNumber"},
    {name: "Email", uid: "email"},
    {name: "Numéro de la Carte Nationale", uid: "identittyCardNumber"},
    {name: "ACTIONS", uid: "actions"},
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
  };

  async function getMembers() {
    const data = await getGymMembers(params.id);
    setMembers(data.sportsFacilitiesMember);
  };

  useEffect(() => {
    getGymById();
    getMembers();
  },[refreshTrigger]);

  useEffect(() => {
    getCoaches();
  },[]);

  const currentGymCoaches = coaches.filter((coach) => coach.id === params.id);
  const maleMembers = members.filter((member) => member.gender === UserGender.male).length;
  const item : ThirdCardItemType = {
    icon : FaPerson ,
    title : "Clients",
    subject : "clients",
    subTitle : "male",
    currentValue : members.length,
    pourcentage : (maleMembers * 100 / members.length) || 0,
  };

  const item2 : ThirdCardItemType = {
    icon : FaPerson ,
    title : "Entraineurs",
    subject : "entraineurs",
    subTitle : "dans cette salle",
    currentValue : coaches.length,
    pourcentage : currentGymCoaches.length * 100 / coaches.length || 0,
  };

  const item3 : ThirdCardItemType = {
    icon : FaPerson ,
    title : "Clients",
    subject : "clients",
    subTitle : "par rapport au max",
    currentValue : members.length || 0,
    pourcentage : (members.length || 0) * 100 / (gym?.capacity || 1),
  };

  const fields = {
    coach : "samidou",
    price : gym?.price?.toString() || "",
    capacity : gym?.capacity?.toString() || "",
  };


  return (
    <div className='flex flex-col gap-12'>
      <section className='grid grid-cols-3 gap-8'>
        <CardStyle3 infos={item} />
        <CardStyle3 infos={item2} />
        <CardStyle3 infos={item3} />
      </section>
      <section className='grid grid-cols-[35%,60%] gap-4'>
        <div className='flex flex-col gap-8'>
          <CardStyle9 title={gym?.name || "Salle de Musculation"} fields={fields} />
        </div>
        <div>
          <Tabs aria-label="Options" className='w-[720px]' classNames={{
            base : "w-full",
            tabList: "w-[50rem] flex flex-row items-center justify-between",
            tab : "w-[10rem]",       
          }}>
            <Tab key="Clients" title="Clients">
              <div className='max-w-[45rem]'>
                <GymContextProvider  setRefreshTrigger={setRefreshTrigger} gymId={params.id} >
                  <GenericDataGrid  Add_Edit_Modal={AddGymClientModal as React.FC<ModalModeProps<DataGridItem>>} columns={columns} items={members} statusColorMap={statusColorMap} comingDataType={'gymClient'} /> 
                </GymContextProvider>
              </div>
            </Tab>  
            <Tab key="Coaches" title="Entraineurs">
              <div className='max-w-[45rem]'>
                <GenericDisplayTable columns={columns} data={coaches}  />
              </div>            
            </Tab>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
