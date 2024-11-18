import Image from 'next/image'
import React from 'react'
import MenuFactureMainImage from "/public/MenuFactureMainImage.svg"
import MenuFactureCornerImage from "/public/MenuFactureCornerImage.svg"



export default function CafeteriaMenuFacturePart1() {
  return (
    <div className='flex flex-col gap-4 justify-center items-center font-snigelt h-full min-h-96 relative text-black'>
        <Image src={MenuFactureMainImage} alt='' width={200} height={200} />
        <h1 className='font-medium text-4xl'>Hotel</h1>
        <Image src={MenuFactureCornerImage} alt='' width={50} height={50} className='absolute top-0 left-0' />
        <Image src={MenuFactureCornerImage} alt='' width={50} height={50} className='absolute bottom-0 left-0' />
    </div>
  )
}
