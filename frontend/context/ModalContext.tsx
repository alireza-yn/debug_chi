"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of our context
interface ModalContextType {
  show: boolean | null;
  setShow: (show: boolean) => void;
}

// Create the context with default values
const AppContext = createContext<ModalContextType | undefined>(undefined);

// Provider component
export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [show, setShow] = useState<boolean | null>(false);

  return (
    <AppContext.Provider value={{ show, setShow }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useModalContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
