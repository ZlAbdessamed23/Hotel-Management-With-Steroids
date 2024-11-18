"use client"

import { PageStructureType, SeventhCardItemType, Event } from '@/app/types/types'
import React, { useEffect, useState } from 'react'
import EventHeroImage from "/public/EventHeroImage.svg";
import NoteImage from "/public/NoteImage.svg";
import { getEvents } from '@/app/utils/funcs';
import AddEventModal from '@/app/main/components/modals/forms/AddEventModal';
import CardStyle8 from '@/app/main/components/cards/CardStyle8';
import PagesStructure from '@/app/main/components/PagesStructure';

export default function ManageEvents() {
  const [events, setEvents] = useState<Event[]>([]);

  const transformData = (data: Event[]): SeventhCardItemType[] => {
    return data.map(event => ({
      title: event.name,
      description: event.description,
      id: event.id || "",
      date: event.createdAt || "",
    }))
  };

  async function fetchEvents() {
    try {
      const fetchedEvents = await getEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const infos: PageStructureType<SeventhCardItemType, Event> = {
    hero: {
      title: "Evennements Management",
      description: "Vous gérez toutes les évennements dans cette section et avez une réflexion approfondie pour organiser votre travail",
      image: EventHeroImage,
      imageDimensions: {
        height: 300,
        width: 300,
      },
    },
    main: {
      AddModal: AddEventModal,
      buttonText: "Ajouter un évennement",
      mainComponent: CardStyle8,
      Icon: NoteImage,
    },
    fetchFunc: getEvents
  }

  return (
    <PagesStructure props={infos} url='/main/employee/reception/manageevents' Icon={NoteImage} transformData={transformData} />
  )
}