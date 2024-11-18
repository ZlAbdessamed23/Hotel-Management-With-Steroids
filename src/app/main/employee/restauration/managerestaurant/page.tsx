"use client"

import React from 'react'
import { PageStructureType, RestauMenu, SeventhCardItemType } from '@/app/types/types';
import RestauImage from "/public/RestauImage.svg";
import RestauMenuImage from "/public/RestauMenuImage.svg";
import { getAllRestauMenus } from '@/app/utils/funcs';
import AddRestauMenuModal from '@/app/main/components/modals/forms/AddRestauMenuModal';
import CardStyle8 from '@/app/main/components/cards/CardStyle8';
import PagesStructure from '@/app/main/components/PagesStructure';

export default function ManageRestauration() {

    const transformData = (data: (RestauMenu)[]): SeventhCardItemType[] => {
      return data.map(menu => ({
        title: menu.name,
        description : menu.description,
        id : menu.id || "",
        date : menu.createdAt || "",
      }))
    }

    const infos: PageStructureType<SeventhCardItemType, RestauMenu> = {
      hero : {
          title : "Restauration Management",
          description : "Vous gérez toutes les menus des repas dans cette section et avez une réflexion approfondie pour organiser votre travail",
          image : RestauImage,
          imageDimensions : {
            height : 300,
            width : 300,
          },
        },
        main : {
          AddModal : AddRestauMenuModal,
          buttonText : "Ajouter un menu",
          mainComponent : CardStyle8,
          Icon : RestauMenuImage
        },
        fetchFunc: getAllRestauMenus
      }
  return (
    <div>
      <PagesStructure props={infos}  url='/main/employee/restauration/managerestaurant' Icon={RestauImage} transformData={transformData}/>
    </div>
  )
}
