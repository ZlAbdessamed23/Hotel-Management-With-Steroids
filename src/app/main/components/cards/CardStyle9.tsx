import { NinthCardItemType } from '@/app/types/types';
import React from 'react';


const CardStyle9: React.FC<NinthCardItemType> = ({ fields , title }) => {
  const keys = Object.keys(fields);
  return (
    <div className='h-fit rounded-3xl bg-secondary text-white p-4 font-sans'>
      <section className='p-4'>
        <p className='text-center text-4xl font-semibold'>{title}</p>
      </section>
      <div className='card-gradient-line mb-12'></div>
      <section className='flex flex-row items-center justify-between pt-12'>
        {keys.map((key, index) => (
          <React.Fragment key={key}>
            <div className='flex flex-col items-center gap-2'>
            <p className='opacity-70 text-base truncate w-24 text-center'>{key}</p>
              <p className='text-lg truncate w-24 text-center'>{fields[key]}</p>
            </div>
            {index < keys.length - 1 && (
              <div className='card-vertical-gradient-line'></div>
            )}
          </React.Fragment>
        ))}
      </section>
    </div>
  );
};

export default CardStyle9;
