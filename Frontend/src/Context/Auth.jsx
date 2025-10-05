
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();


const api = axios.create({
  baseURL: "https://taskly-s9nt.onrender.com", 
  withCredentials: true, 
});

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null); 
  const [loading, setLoading] = useState(true); 

  const updateToken = (token) => setAccessToken(token);


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

 
  useEffect(() => {
   
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

   
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const { data } = await api.get("/refresh");
            updateToken(data.accessToken);

            
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
