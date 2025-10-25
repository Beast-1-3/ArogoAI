/* eslint-disable no-unused-vars */
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useQuery } from "@tanstack/react-query";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await API.get("/auth/me");
        setUser(data.data);
      } catch (error) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
