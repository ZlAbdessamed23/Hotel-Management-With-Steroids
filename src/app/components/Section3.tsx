import Image from 'next/image'
import React from 'react'
import StripeImage from "/public/StripeImage.svg";


const CardDisplay: React.FC<{props : {title : string , subject1 : string , subject2 : string , text : string} , index : number}> = ({props , index}) => {

  return (
    <div className={` test-glass-shining-effect flex flex-col justify-between absolute shadow-xl dark dark:bg-gray-800 ${index === 0 ? "md:right-0 top-0 z-50" : index === 1 ? "left-0 top-[11rem] z-30" : "md:right-0 bottom-0 z-10" }`}>
      <h3 className='text-primary-500 text-2xl font-semibold'>{props.title}</h3>
      <p className='text-lg font-medium'>{props.text}</p>
      <section className='flex items-center justify-between'>
        <div className='flex items-center gap-1'>
          <span className='h-4 w-4 rounded-full bg-primary-500'></span>
          <span>{props.subject1}</span>
        </div>
        <div className='flex items-center gap-1'>
          <span className='h-4 w-4 rounded-full bg-primary-700'></span>
          <span>{props.subject2}</span>
        </div>
      </section>


      <div className='first-test-kid'></div>
      <div className='second-test-kid'></div>
      <div className='third-test-kid'></div>
      <div className='fourth-test-kid'></div>
    </div>
  )

};

const items :  Array<{title : string , subject1 : string , subject2 : string , text : string}> = [
  {
    title : "Tasks",
    text : "Optimisez les opérations en cuisine avec notre Gestionnaire de Tâches, permettant aux chefs d'assigner les tâches de manière efficace et organisée.",
    subject1 : "Créer des Tâches",
    subject2 : "Tâches Statistiques",
  },
  {
    title : "Tasks",
    text : "Optimisez les opérations en cuisine avec notre Gestionnaire de Tâches, permettant aux chefs d'assigner les tâches de manière efficace et organisée.",
    subject1 : "Créer des Tâches",
    subject2 : "Tâches Statistiques",
  },
  {
    title : "Tasks",
    text : "Organisez et accédez à tous vos fichiers et documents connexes de manière fluide avec notre gestionnaire.",
    subject1 : "Créer des Rapports",
    subject2 : "les droits d'acces",
  },
];


export default function Section3() {
  return (
    <div className='w-10/12 mx-auto'>
      <h1 className='text-3xl text-shadow-md leading-[3rem] lg:text-shadow-lg lg:text-5xl font-semibold lg:leading-[4rem] text-primary-500'>Am&eacute;liorer La Collaboration</h1>
      <p className='text-xl text-gray-500 w-96 md:w-[30rem] mb-12 md:mb-0'>Renforcez la collaboration de votre &eacute;quipe gr&acirc;ce &agrave; notre outil qui int&egrave;gre la gestion des t&acirc;ches, la messagerie et les rapports.</p>
      <section className='flex flex-col md:flex-row items-center gap-8'>
        <div className='w-full md:w-1/2 relative h-[39.5rem] overflow-x-hidden'>
          {
            items.map((item , index) => <CardDisplay key={index} props={item} index={index} />)
          }
        </div>
        <div className=' w-full md:w-1/2'>
          <Image src={StripeImage} alt='' width={550} height={550} />
        </div>
      </section>
    </div>
  )
}
