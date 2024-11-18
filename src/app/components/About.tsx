import React from 'react'
import CloudyVerse from "/public/CloudyVerse.svg";
import Image from 'next/image';

const Item : React.FC<{props : {title : string , text : string}}> = ({props}) => {
  return (
    <div className='p-2 rounded-lg shadow-md border border-landing-pink '>
      <p className='text-xl font-semibold mb-2'>{props.title}</p>
      <p className='text-gray-500 font-medium text-lg'>{props.text}</p>
    </div>
  )
};

const itemsData : Array<{title : string , text : string}> = [
  {
    title : "Qui sommes-nous ?",
    text : "CloudyVerse est un leader dans la fourniture de solutions logicielles basées sur le cloud, conçues pour rationaliser les opérations.",
  },
  {
    title : "Notre interface conviviale",
    text : "Notre interface intuitive garantit que les utilisateurs peuvent rapidement apprendre et utiliser efficacement le système sans formation approfondie.",
  },
  {
    title : "Notre sécurité des données",
    text : "Nous mettons en place des mesures de sécurité avancées et un chiffrement des données pour protéger vos informations sensibles.",
  },
  {
    title : "Amélioration de l'efficacité",
    text : "Notre suite d'outils complète automatise les tâches quotidiennes, permettant à votre équipe de se concentrer sur les activités essentielles de l'entreprise.",
  },
  {
    title : "Support client",
    text : "CloudyVerse offre un support client 24h/24 et 7j/7, garantissant que l'assistance est disponible dès que vous en avez besoin.",
  },
  {
    title : "Scalabilité",
    text : "CloudyVerse est conçu pour évoluer avec votre entreprise, que vous gériez une petite startup ou une grande entreprise.",
  },
  {
    title : "Fonctionnalités de reporting",
    text : "CloudyVerse offre des capacités de reporting robustes, vous permettant de générer des rapports détaillés sur divers aspects.",
  },
  {
    title : "Intégration",
    text : "Notre plateforme s'intègre parfaitement avec divers systèmes tiers, y compris les passerelles de paiement et les logiciels de comptabilité.",
  },
  {
    title : "Communication",
    text : "CloudyVerse comprend des fonctionnalités pour une communication simplifiée, telles que des notifications automatisées et des outils de messagerie.",
  },
  {
    title : "Plans de formation",
    text : "Nous proposons des programmes de formation complets et des ressources pour garantir que votre équipe puisse tirer pleinement parti de toutes les fonctionnalités.",
  },
];

export default function About() {
  return (
    <div className='w-full px-4 mx-auto' id='about-div-container'>
      <h1 className='text-3xl text-shadow-md leading-[3rem] lg:text-shadow-lg lg:text-5xl font-semibold lg:leading-[4rem] text-center text-landing-pink'>About Us</h1>
      <p className='text-xl pl-1 text-center text-gray-500 mb-8'>Am&eacute;liorez la collaboration de votre &eacute;quipe avec notre outil qui int&egrave;gre la gestion des t&acirc;ches, la messagerie et les rapports.</p>
      <section className='w-full grid grid-rows-10 md:grid-rows-none md:grid-cols-5 gap-4 mb-12'>
        {
          itemsData.map((data) => <Item key={data.title} props={data} />)
        }
      </section>
      <section className='flex items-center justify-center'>
        <Image src={CloudyVerse} alt='' width={200} height={200} />
      </section>
    </div>
  )
}
