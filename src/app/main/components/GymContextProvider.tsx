import React, { useState } from 'react';

interface GymContextType {
  gymId: string;
  setRefreshTrigger: React.Dispatch<React.SetStateAction<number>>;
};

export const GymMenuContext = React.createContext<GymContextType | undefined>(undefined);

export function useGymMenuContext() {
  const context = React.useContext(GymMenuContext);
  const [holder, setHolder] = useState<number>(0);
  return context || {
    gymId: "",
    setRefreshTrigger: setHolder
  };
};

export const GymContextProvider: React.FC<GymContextType & { children: React.ReactNode }> = ({ gymId, setRefreshTrigger, children }) => {
  return (
    <GymMenuContext.Provider value={{ gymId, setRefreshTrigger }}>
      {children}
    </GymMenuContext.Provider>
  );
};