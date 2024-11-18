"use client"

import React from 'react'
import { CafeteriaMenu, PageStructureType, SeventhCardItemType } from '@/app/types/types'
import CafeteriaImage from "/public/CafeteriaImage.svg"
import { getAllCafeteriaMenus } from '@/app/utils/funcs'
import AddCafeteriaMenuModal from '@/app/main/components/modals/forms/AddCafeteriaMenuModal'
import CardStyle8 from '@/app/main/components/cards/CardStyle8'
import PagesStructure from '@/app/main/components/PagesStructure'

export default function ManageCafeteria() {
  const transformData = (data: (CafeteriaMenu)[]): SeventhCardItemType[] => {
    return data.map(menu => ({
      title: menu.name,
      description : menu.description,
      id : menu.id || "",
      date : menu.createdAt || "",
      // Add other necessary properties to match SeventhCardItemType
    }))
  }

  const infos: PageStructureType<SeventhCardItemType, CafeteriaMenu> = {
    hero: {
      title: "Cafeteria Management",
      description: "Vous gérez toutes les menus des boissons dans cette section et avez une réflexion approfondie pour organiser votre travail",
      image: CafeteriaImage,
      imageDimensions: {
        height: 300,
        width: 300,
      },
    },
    main: {
      AddModal: AddCafeteriaMenuModal,
      buttonText: "Ajouter un menu",
      mainComponent: CardStyle8,
      Icon : CafeteriaImage,
    },
    fetchFunc: getAllCafeteriaMenus,
  }

  return (
    <div>
      <PagesStructure
        props={infos}
        url='/main/employee/restauration/managecafeteria'
        transformData={transformData}
        Icon={CafeteriaImage}
      />
    </div>
  )
}