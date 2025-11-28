import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import API from "../api/api";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    API.get("/settings")
      .then((res) => {
        if (isMounted) setSettings(res.data);
      })
      .catch((err) => console.error("Settings fetch failed:", err));

    return () => {
      isMounted = false;
    };
  }, [user]);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
