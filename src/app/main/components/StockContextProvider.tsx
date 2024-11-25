import React, { useState } from 'react';

interface StockContextType {
  stockId: string;
  setRefreshTrigger: React.Dispatch<React.SetStateAction<number>>;
};

export const StockMenuContext = React.createContext<StockContextType | undefined>(undefined);

export function useStockMenuContext() {
  const context = React.useContext(StockMenuContext);
  const [holder, setHolder] = useState<number>(0);
  return context || {
    stockId: "",
    setRefreshTrigger: setHolder
  };
};

export const StockContextProvider: React.FC<StockContextType & { children: React.ReactNode }> = ({ stockId , setRefreshTrigger, children }) => {
  return (
    <StockMenuContext.Provider value={{ stockId , setRefreshTrigger }}>
      {children}
    </StockMenuContext.Provider>
  );
};