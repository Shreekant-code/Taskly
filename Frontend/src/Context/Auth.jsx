// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// --- Create Auth Context
const AuthContext = createContext();

// --- Axios instance (shared across all components)
const api = axios.create({
  baseURL: "https://todo-app-5-inws.onrender.com", // your backend URL
  withCredentials: true, // important to send cookies (refresh token)
});

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null); // stores JWT access token
  const [loading, setLoading] = useState(true); // tracks auth initialization

  // --- Helper to update access token
  const updateToken = (token) => setAccessToken(token);

  // --- Logout helper
  const logout = async () => {
    try {
      await api.post("/logout"); // backend clears refresh token cookie
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setAccessToken(null);
    }
  };

  // --- Initialize auth on mount: try to refresh token
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await api.get("/refresh"); // sends refresh cookie automatically
        updateToken(data.accessToken);
      } catch {
        updateToken(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  // --- Attach Axios interceptors (once, clean up on unmount)
  useEffect(() => {
    // Request interceptor: attach access token
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor: handle 401 errors (refresh token)
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const { data } = await api.get("/refresh");
            updateToken(data.accessToken);

            // Retry the failed request with new token
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return api(originalRequest);
          } catch (err) {
            updateToken(null); // refresh failed, user must login
            return Promise.reject(err);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken: updateToken,
        logout,
        loading,
        api, // shared Axios instance
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// --- Custom hook to consume auth context
export const useAuth = () => useContext(AuthContext);
