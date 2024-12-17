"use client"

import { CircularBarDataType } from '@/app/types/types';
import { Button, CircularProgress } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'


type SectionType = "gender" | "age" | "origin"

export default function MultiPagesCircularProgress({ data }: { data: CircularBarDataType[] }) {

  const [desiredSection, setDesiredSection] = useState<SectionType>("gender");
  const [displayedItem , setDisplayedItem] = useState<CircularBarDataType>(data[0]); 

  function handleSetSection(path: SectionType) {
    setDesiredSection(path);
  };

  useEffect(() => {
    if (desiredSection === "gender") {
      setDisplayedItem(data[0]);
    }
    else if(desiredSection === "age") {
      setDisplayedItem(data[1]);
    }
    else {
      setDisplayedItem(data[2]);
    };
  }, [desiredSection]);

  return (
    <div className='text-black dark:text-gray-50'>
      <section className='w-10/12 lg:w-full mx-auto flex items-center justify-between mb-6'>
        <Button variant='solid' color={desiredSection === "gender" ? 'danger' : 'default'} onClick={() => handleSetSection("gender")}>Sexe</Button>
        <Button variant='solid' color={desiredSection === "age" ? 'danger' : 'default'} onClick={() => handleSetSection("age")}>Age</Button>
        <Button variant='solid' color={desiredSection === "origin" ? 'danger' : 'default'} onClick={() => handleSetSection("origin")}>Origine</Button>
      </section>
      <section className='flex justify-center items-center relative'>
        <p className='absolute text-3xl font-semibold'>{displayedItem.value1 + displayedItem.value2}</p>
        <CircularProgress
          className='absolute'
          classNames={{
            svg: "w-40 h-40 drop-shadow-md",
            indicator: "stroke-primary",
            track: "stroke-white/10",
            value: "text-3xl font-semibold text-black",
          }}
          value={displayedItem.value1 * 100 / (displayedItem.value1 + displayedItem.value2)}
          strokeWidth={3}
        />
        <CircularProgress
          classNames={{
            svg: "w-56 h-56 drop-shadow-md",
            indicator: "stroke-warning",
            track: "stroke-white/10",
            value: "text-3xl font-semibold text-black",
          }}
          value={displayedItem.value2 * 100 / (displayedItem.value1 + displayedItem.value2)}
          strokeWidth={3}
        />
      </section>
      <section className='px-6 flex items-center justify-between py-2 text-black'>
        <div className='flex items-center gap-1'>
          <span className='h-4 w-4 bg-primary rounded-md'></span>
          <p className='dark:text-gray-50'>{displayedItem.dataKey1}</p>
        </div>
        <div className='flex items-center gap-1'>
          <span className='h-4 w-4 bg-warning rounded-md'></span>
          <p className='dark:text-gray-50'>{displayedItem.dataKey2}</p>
        </div>
      </section>
    </div>
  )
}
