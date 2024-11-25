import React from 'react'

interface TimeLineStageProps {
    stage: {
        id?: string;
        start: string |Date;
        end: string | Date;
        description: string;
        title : string;
    };
    color: string;
};

const colors: Array<string> = ["bg-primary", "bg-secondary", "bg-success", "bg-warning", "bg-danger"];

const TimeLineStage: React.FC<TimeLineStageProps> = ({ stage, color }) => {
    return <div className='rounded-lg shadow-sm flex items-center max-h-28 overflow-hidden'>
        <span className={`h-[5.75rem] flex items-center justify-center rounded-l-md w-2 ${color}`}></span>
        <span className={`flex flex-col justify-center p-2 w-full ${color} bg-opacity-15`}>
            <p className='text-xl font-semibold'>{stage.title}</p>
            <p className='text-md font-normal text-gray-500 text-opacity-85'>{stage.start.toLocaleString()}</p>
            <p className='text-md font-normal text-gray-500 text-opacity-85'>{stage.end.toLocaleString()} </p>
        </span>
    </div>
}


export default function CustomEventTimeline({ events }: {
    events: {
        id?: string;
        start: string | Date;
        end: string | Date;
        description: string;
        title : string;
    }[]
}) {

    const today = new Date();

    const options: Intl.DateTimeFormatOptions = {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    };
    const formattedDate = today.toLocaleDateString('fr-FR', options);

    return (
        <div className='bg-white p-2 rounded-xl dark:bg-slate-800'>
            <section className='mb-4'>
                <span className='text-md font-light text-gray-500 text-opacity-85'>{formattedDate}</span>
            </section>
            <section className='flex flex-col mb-[2.3rem] gap-3'>
                {
                    events.map((event, index) => (
                        <TimeLineStage key={event.id} stage={event} color={colors[index % colors.length]} />
                    ))
                }
            </section>
        </div>
    )
}
