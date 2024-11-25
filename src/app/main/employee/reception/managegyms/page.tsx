"use client"

import { PageStructureType, SeventhCardItemType, SportHall } from '@/app/types/types'
import GymEquipements from "/public/GymEquipements.svg";
import GymHeroImage from "/public/GymHeroImage.svg";
import { getGyms } from '@/app/utils/funcs';
import CardStyle8 from '@/app/main/components/cards/CardStyle8';
import AddGymModal from '@/app/main/components/modals/forms/AddGymModal';
import PagesStructure from '@/app/main/components/PagesStructure';

export default function ManageGyms() {

  const transformData = (data: (SportHall)[]): SeventhCardItemType[] => {
    return data.map(gym => ({
      title: gym.name,
      description : gym.description,
      id : gym.id || "",
      date : gym.createdAt || "",
    }))
  }

  const infos : PageStructureType<SeventhCardItemType , SportHall> = {
    hero : {
      title : "Salle de Sports Management",
      description : "Vous gérez toutes les salles de sports dans cette section et avez une réflexion approfondie pour organiser votre travail",
      image : GymHeroImage,
      imageDimensions : {
        height : 300,
        width : 300,
      },
    },
    main : {
      AddModal : AddGymModal,
      buttonText : "Ajouter une salle de sport",
      mainComponent : CardStyle8,
      Icon : GymEquipements,
    },
    fetchFunc: () => getGyms()
  }
  return (
    <PagesStructure Icon={GymEquipements} transformData={transformData} props={infos} url='/main/employee/reception/managegyms'  />
  )
}
