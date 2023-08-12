import { createContext, useContext, useState } from "react";

const ActiveTabContext = createContext();
export const useActiveTabContext = () => {
  return useContext(ActiveTabContext);
};

export const ActiveTabProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <ActiveTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </ActiveTabContext.Provider>
  );
};
