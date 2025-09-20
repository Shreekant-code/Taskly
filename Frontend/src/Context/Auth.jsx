// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();


const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // important to send cookies
});

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Update token helper
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

  // --- Request interceptor to attach access token
  api.interceptors.request.use(
    (config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // --- Response interceptor to handle expired tokens
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const { data } = await api.get("/refresh"); // sends refresh cookie automatically
          updateToken(data.accessToken);

          // retry failed request with new token
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } catch (err) {
          updateToken(null);
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    }
  );

  
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await api.get("/refresh");
        updateToken(data.accessToken);
      } catch {
        updateToken(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken: updateToken, logout, loading, api }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
