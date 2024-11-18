import React, { useState } from 'react';

interface RefreshMenuContextType {
  setFetchTrigger : React.Dispatch<React.SetStateAction<number>>;
}

export const RefreshMenuContext = React.createContext<RefreshMenuContextType | undefined>(undefined);

export function useRefreshMenuContext() {
  const [holder , setHolder] = useState<number>(0);
  const context = React.useContext(RefreshMenuContext);
  return context || {
    setFetchTrigger : setHolder,
  };
};

export const RefreshMenuProvider: React.FC<RefreshMenuContextType & { children: React.ReactNode }> = ({ setFetchTrigger , children }) => {
  return (
    <RefreshMenuContext.Provider value={{setFetchTrigger}}>
      {children}
    </RefreshMenuContext.Provider>
  );
};