"use client";

import { Main, UserBankCard } from "@/components/types/user.types";
import { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of our context
interface ModalContextType {
  user:Main | null;
  setUserData: (user: Main) => void;
//   addCard: UserBankCard | null;
//   setAddCard: (card: UserBankCard) => void;
}

// Create the context with default values
const AppContext = createContext<ModalContextType | undefined>(undefined);


export const UserInfoProvider = ({ children } : { children: ReactNode }) => {
  const [user, setUserData] = useState<Main | null>(null);
    

    

  return (
    <AppContext.Provider value={{ user, setUserData }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useUserContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
