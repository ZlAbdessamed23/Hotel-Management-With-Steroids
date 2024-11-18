import { EventStage } from '@/app/types/types';
import React from 'react';


export default function EventTimeline({events} : {events : EventStage[]}){
    
  return (
    <div className="flex justify-center absolute left-0">
      <div className="relative mx-5 my-10 w-1 bg-black">
        {events.map((event, index) => (
          <div key={index} className="relative my-5 pl-5">
            <div className="absolute top-0 left-[-0.5rem] w-5 h-5 bg-white border-2 border-black rounded-full"></div>
            <div className="ml-5 w-full">
              <h3 className="m-0 text-lg font-semibold w-40">{event.title}</h3>
              <p className="m-0 text-gray-600 w-40 h-6 overflow-hidden text-ellipsis">{event.start.toString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

