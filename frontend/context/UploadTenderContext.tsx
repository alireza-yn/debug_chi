"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";


// Define the shape of our context
interface TenderType {
  mode?: "tender" | "auction";
  title?: string;
  description?: string;
  project?:number,
  start_time?: string;
  end_time?: string;
  start_bid?: number;
  image?: File;
}
interface ProjectType {
  project_id?:number;
  type_class?: "private" | "public";
  class_title?: string;
  description?: string;
  educational_heading?: string;
  educational_heading_file?: File | null;
  start_date?: string;
  end_date?: string;
  buffer_date?: number;
  is_deleted?: boolean;
  language?: string;
  expertise?: string;
  created_by?: number;
  is_tender?: boolean;
}
interface TenderContextType {
  images: any[];
  setImages: (image:any[])=>void;
  tender: TenderType | null;
  setTenderData: (tender: TenderType) => void;
  project: ProjectType | null;
  setProjectData: (project: ProjectType) => void;
}

// Create the context with default values
const AppContext = createContext<TenderContextType | undefined>(undefined);

export const TenderProvider = ({ children }: { children: ReactNode }) => {
  const [tender, setTenderData] = useState<TenderType | null>(null);
  const [project, setProjectData] = useState<ProjectType | null>(null);
  const [images,setImages] = useState<any[]>([])
  return (
    <AppContext.Provider
      value={{ tender, setTenderData, setProjectData, project, images, setImages }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const tenderContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
