import React, { useState } from 'react';

interface EventContextType {
  eventId : string;
  stagesRefreshTrigger : number;
  clientsRefreshTrigger : number;
  setStagesRefreshTrigger : React.Dispatch<React.SetStateAction<number>>;
  setClientsRefreshTrigger : React.Dispatch<React.SetStateAction<number>>;
};

export const EventContext = React.createContext<EventContextType | undefined>(undefined);

export function useEventContext() {
  const [holder , setHolder] = useState<number>(0);
  const [holder2 , setHolder2] = useState<number>(0);
  const context = React.useContext(EventContext);
  return context || {
    eventId : "",
    clientsRefreshTrigger : 0,
    stagesRefreshTrigger : 0,
    setStagesRefreshTrigger : setHolder,
    setClientsRefreshTrigger : setHolder2,
  };
};

export const EventContextProvider: React.FC<EventContextType & { children: React.ReactNode }> = ({ eventId , stagesRefreshTrigger , clientsRefreshTrigger , setClientsRefreshTrigger  , setStagesRefreshTrigger  , children }) => {
  return (
    <EventContext.Provider value={{ eventId , stagesRefreshTrigger , clientsRefreshTrigger  , setClientsRefreshTrigger  , setStagesRefreshTrigger}}>
      {children}
    </EventContext.Provider>
  );
};