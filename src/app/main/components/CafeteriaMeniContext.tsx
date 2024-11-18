import React, { useState } from 'react';

interface CafeteriaMenuContextType {
  fetchType : "restau" | "cafeteria";
  cafeteriaMenuId: string;
  cafeteriaId : string;
  fetchTrigger : number;
  setFetchTrigger : React.Dispatch<React.SetStateAction<number>>;
}

export const CafeteriaMenuContext = React.createContext<CafeteriaMenuContextType | undefined>(undefined);

export function useCafeteriaMenuContext() {
  const [holder , setHolder] = useState<number>(0);
  const context = React.useContext(CafeteriaMenuContext);
  return context || {
    fetchType : "restau",
    cafeteriaMenuId : "",
    fetchTrigger : 0,
    cafeteriaId : "",
    setFetchTrigger : setHolder,
  };
};

export const CafeteriaMenuProvider: React.FC<CafeteriaMenuContextType & { children: React.ReactNode }> = ({ cafeteriaId , cafeteriaMenuId , fetchTrigger , setFetchTrigger , fetchType , children }) => {
  return (
    <CafeteriaMenuContext.Provider value={{ cafeteriaId , cafeteriaMenuId , fetchTrigger , setFetchTrigger , fetchType }}>
      {children}
    </CafeteriaMenuContext.Provider>
  );
};