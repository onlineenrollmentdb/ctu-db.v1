import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/api";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    let isMounted = true;

    API.get("/settings")
      .then((res) => {
        if (isMounted) setSettings(res.data);
      })
      .catch((err) => console.error("Settings fetch failed:", err));

    return () => (isMounted = false);
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
