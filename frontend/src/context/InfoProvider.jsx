import { createContext, useContext, useEffect, useState } from "react";

const InfoContext = createContext();

export const InfoProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    const savedId = localStorage.getItem("id");

    if (savedToken && savedRole) {
      setToken(savedToken);
      setRole(savedRole);
      setId(savedId);
    }

    setLoading(false); // 🔴 THIS IS MUST
  }, []);

  const login = ({ token, role, id }) => {
    setToken(token);
    setRole(role);
    setId(id);

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("id", id);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setId(null);
    localStorage.clear();
  };

  return (
    <InfoContext.Provider value={{ token, role, id, loading, login, logout }}>
      {children}
    </InfoContext.Provider>
  );
};

export const useInfo = () => useContext(InfoContext);
