'use client';
import { FC, useState, createContext } from 'react';

type SidebarContextType = {
  sidebarToggle: boolean;  // Change to boolean
  toggleSidebar: () => void;
  closeSidebar: () => void;
};

export const SidebarContext = createContext<SidebarContextType>(
  {} as SidebarContextType
);

type SidebarProviderProps = {
  children: React.ReactNode;
};

export const SidebarProvider: FC<SidebarProviderProps> = ({ children }) => {
  const [sidebarToggle, setSidebarToggle] = useState<boolean>(false); // Specify boolean type

  const toggleSidebar = () => {
    setSidebarToggle(prev => !prev); // Using prev to toggle state
  };

  const closeSidebar = () => {
    setSidebarToggle(false);
  };

  return (
    <SidebarContext.Provider
      value={{ sidebarToggle, toggleSidebar, closeSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
