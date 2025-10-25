/* eslint-disable no-unused-vars */
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch user data using React Query
  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const { data } = await API.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Login function
  const login = async (token) => {
    // Set token in localStorage
    localStorage.setItem("token", token);

    // Set the authorization header for future requests
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Re-fetch user data with the new token
    await refetch();

    // Check if user data was successfully fetched
    if (user) {
      // Navigate based on role
      navigate(
        user.role === "doctor" ? "/dashboard/doctor" : "/dashboard/patient"
      );
    } else {
      // Handle case where user data couldn't be fetched
      console.error("User data not available after login");
      // You might want to show an error or redirect to login
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    queryClient.invalidateQueries(["user"]); // Clear cache
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing auth state
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
