import Image from 'next/image';
import React from 'react'
import Server1 from "/public/Server1.svg";
import Server2 from "/public/Server2.svg";
import Network from "/public/Network.svg";
import CircleShape from "/public/CircleShape.svg";
import CircleShapeDark from "/public/CircleShapeDark.svg";
import WeirdShape from "/public/WeirdShape.svg";
import WeirdShapeDark from "/public/WeirdShapeDark.svg";
import Cloud from "/public/Cloud.svg";
import CloudDark from "/public/CloudDark.svg";
import DriveCollection from "/public/DriveCollection.svg";
import VisaGroup from "/public/VisaGroup.svg";
import { TbWorldCog } from "react-icons/tb";
import { FaCheck } from "react-icons/fa";
import { MdOutlineSecurity } from "react-icons/md";
import { GoDatabase } from "react-icons/go";
import { RiNumber3 } from "react-icons/ri";
import { IoMdCloudOutline } from "react-icons/io";

const Item1 : React.FC = () => {
    return (
        <div className='p-4 shadow-md rounded-xl bg-gray-200 dark:bg-gray-800 h-[31rem] lg:h-96 grid grid-cols-2 gap-4 w-full lg:w-[49%] '>
            <section className='flex flex-col justify-between'>
                <div className='flex flex-col gap-4'>
                    <TbWorldCog className='text-landing-pink size-11 p-2 bg-gray-300 rounded-md shadow-md' />
                    <h3 className='text-landing-pink text-xl font-semibold'>Maintenance</h3>
                    <p className='text-gray-500 dark:text-gray-400 text-lg font-medium'>Notre &eacute;quipe assure une maintenance fluide de notre syst&egrave;me gr&acirc;ce &agrave; des mises &agrave; jour r&eacute;guli&egrave;res.</p>
                </div>
                <div className='flex flex-col gap-2'>
                    <section className='flex items-center gap-2'>
                        <FaCheck className='size-6 border-2 border-black rounded-full p-1 dark:border-white' />
                        <span className='text-base font-medium'>Assistance technique disponible 24/7.</span>
                    </section>
                    <section className='flex items-center gap-2'>
                        <FaCheck className='size-6 border-2 border-black rounded-full p-1 dark:border-white' />
                        <span className='text-base font-medium'>services de r&eacute;cup&eacute;ration</span>
                    </section>
                    <section className='flex items-center gap-2'>
                        <FaCheck className='size-6 border-2 border-black rounded-full p-1 dark:border-white' />
                        <span className='text-base font-medium'>Fonctionnalit&eacute;s personnalis&eacute;es</span>
                    </section>
                </div>
            </section>
            <section className='flex justify-center items-center'>
                <Image src={Server1} alt='' width={200} height={200} />
            </section>
        </div>
    )
}; 
const Item2 : React.FC = () => {
    return (
        <div className='p-4 shadow-md relative rounded-xl bg-gray-200 dark:bg-gray-800 h-96 w-full lg:w-[23%] '>
            <Image src={CircleShape} alt='' width={100} height={100} className='absolute top-1/3 left-4' />
            <Image src={CircleShapeDark} alt='' width={100} height={100} className='hidden dark:block dark:absolute dark:top-1/3 dark:left-4' />
            <section className='flex flex-col items-center gap-4 mb-2'>
                <TbWorldCog className='text-landing-pink size-11 p-2 bg-gray-300 rounded-md shadow-md' />
                <h3 className='text-landing-pink text-xl font-semibold'>Accessibilt&eacute;</h3>
                <p className='text-gray-500 dark:text-gray-400 text-lg font-medium text-center z-10'>Le SaaS permet un acc&egrave;s depuis n&#39;importe quel appareil, offrant ainsi une grande flexibilit&eacute;.</p>
            </section>
            <section className='flex justify-end'>
                <Image src={Network} alt='' width={150} height={150}/>
            </section>
        </div>
    )
}; 

const Item3 : React.FC = () => {
    return (
        <div className='p-4 shadow-md relative rounded-xl bg-gray-200 dark:bg-gray-800 h-96 w-full lg:w-[23%]'>
            <Image src={WeirdShape} alt='' width={100} height={100} className='absolute top-1/3 left-4 dark:hidden' />
            <Image src={WeirdShapeDark} alt='' width={100} height={100} className='hidden dark:block dark:absolute dark:top-1/3 dark:left-4' />
            <section className='flex flex-col items-center gap-2 mb-2'>
                <MdOutlineSecurity className='text-landing-pink size-11 p-2 bg-gray-300 rounded-md shadow-md' />
                <h3 className='text-landing-pink text-xl font-semibold'>S&eacute;curit&eacute;</h3>
                <p className='text-gray-500 dark:text-gray-400 text-lg font-medium text-center z-10'>Assurez une s&eacute;curit&eacute; robuste dans notre syst&egrave;me de gestion h&ocirc;teli&egrave;re.</p>
            </section>
            <section className='grid grid-cols-2 gap-4'>
                <span className='p-2 border text-xs border-gray-400 bg-transparent text-secondary-400 z-30 rounded-lg text-center'>
                    axBe21#aa_lll
                </span>
                <span className='p-2 border border-gray-400 bg-transparent text-xs text-secondary-400 z-30 rounded-lg text-center'>
                    Authorization
                </span>
                <span className='p-2 border border-gray-400 bg-transparent text-xs text-secondary-400 z-30 rounded-lg text-center'>
                    acces par role
                </span>
                <span className='p-2 border border-gray-400 bg-transparent text-xs text-secondary-400 z-30 rounded-lg text-center'>
                    lll_axBe21#aa
                </span>
                <span className='p-2 border border-gray-400 bg-transparent text-xs text-secondary-400 z-30 rounded-lg text-center'>
                    transmission s&eacute;curis&eacute;
                </span>
                <span className='p-2 border border-gray-400 bg-transparent text-xs text-secondary-400 z-30 rounded-lg text-center'>
                    codage des donn&eacute;es
                </span>
            </section>
        </div>
    )
}; 

const Item4 : React.FC = () => {
    return (
        <div className='p-4 shadow-md relative rounded-xl bg-gray-200 dark:bg-gray-800 h-96 w-full lg:w-[23%] '>
            <Image src={Cloud} alt='' width={100} height={100} className='absolute top-1/3 left-4' />
            <Image src={CloudDark} alt='' width={100} height={100} className='hidden dark:block dark:absolute dark:top-1/3 dark:left-4' />
            <section className='flex flex-col items-center gap-2 mb-6'>
                <GoDatabase className='text-landing-pink size-11 p-2 bg-gray-300 rounded-md shadow-md' />
                <h3 className='text-landing-pink text-xl font-semibold'>Stockage</h3>
                <p className='text-gray-500 dark:text-gray-400 text-lg font-medium text-center z-10'>Notre syst&egrave;me de gestion h&ocirc;teli&egrave;re utilise des solutions de stockage s&eacute;curis&eacute;es et &eacute;volutives.</p>
            </section>
            <section className='flex'>
                <Image src={DriveCollection} alt='' width={300} height={300} />
            </section>
        </div>
    )
}; 

const Item5 : React.FC = () => {
    return (
        <div className='p-4 shadow-md relative rounded-xl bg-gray-200 dark:bg-gray-800 h-96 w-full lg:w-[23%] '>
            <Image src={Cloud} alt='' width={100} height={100} className='absolute top-1/3 left-4' />
            <Image src={CloudDark} alt='' width={100} height={100} className='hidden dark:block dark:absolute dark:top-1/3 dark:left-4' />
            <section className='flex flex-col items-center gap-4 mb-2'>
                <RiNumber3 className='text-landing-pink size-11 p-2 bg-gray-300 rounded-md shadow-md' />
                <h3 className='text-landing-pink text-xl font-semibold'>Third-Party</h3>
                <p className='text-gray-500 dark:text-gray-400 text-lg font-medium text-center z-10'>Notre syst&egrave;me de gestion h&ocirc;teli&egrave;re s&#39;int&egrave;gre avec des services tiers de confiance.</p>
            </section>
            <section className='flex justify-end'>
                <Image src={VisaGroup} alt='' width={220} height={220} />
            </section>
        </div>
    )
}; 

const Item6 : React.FC = () => {
    return (
        <div className='p-4 shadow-md rounded-xl bg-gray-200 dark:bg-gray-800 h-[26.5rem] lg:h-96 grid grid-cols-2 gap-4 w-full lg:w-[49%] '>
            <section className='flex flex-col justify-between'>
                <div className='flex flex-col gap-4'>
                    <IoMdCloudOutline className='text-landing-pink size-11 p-2 bg-gray-300 rounded-md shadow-md' />
                    <h3 className='text-landing-pink text-xl font-semibold'>Les Services du Cloud</h3>
                    <p className='text-gray-500 dark:text-gray-400 text-lg font-medium'>Les services cloud pour la gestion h&ocirc;teli&egrave;re am&eacute;liorent l&#39;efficacit&eacute;, l&#39;&eacute;volutivit&eacute;, et la s&eacute;curit&eacute;.</p>
                </div>
                <div className='flex flex-col gap-2'>
                    <section className='flex items-center gap-2'>
                        <FaCheck className='size-6 border-2 border-black rounded-full p-1 dark:border-white' />
                        <span className='text-base font-medium'>Serveur S&eacute;curis&eacute;</span>
                    </section>
                    <section className='flex items-center gap-2'>
                        <FaCheck className='size-6 border-2 border-black rounded-full p-1 dark:border-white' />
                        <span className='text-base font-medium'>services de r&eacute;cup&eacute;ration</span>
                    </section>
                </div>
            </section>
            <section className='flex justify-center items-center'>
                <Image src={Server2} alt='' width={200} height={200} />
            </section>
        </div>
    )
}; 

export default function Section4() {
  return (
    <div className='w-10/12 mx-auto'>
        <section className='mb-8'>
            <h1 className='text-3xl text-shadow-md leading-[3rem] lg:text-shadow-lg lg:text-5xl font-semibold lg:leading-[4rem] text-landing-pink'>Principales Caract&eacute;ristiques du Saas </h1>
            <p className='text-xl text-gray-500 w-96 md:w-[30rem]'>Notre syst&egrave;me est une solution SaaS con&ccedil;ue pour offrir des fonctionnalit&eacute;s &eacute;volutives et accessibles, permettant de g&eacute;rer et d&#39;optimiser vos op&eacute;rations</p>
        </section>
        <section className='flex flex-col lg:flex-row flex-wrap gap-6'>
            <Item1 />
            <Item2 />
            <Item3 />
            <Item4 />
            <Item5 />
            <Item6 />
        </section>
    </div>
  )
}
