import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/Auth";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      setAccessToken(token);
      window.history.replaceState({}, document.title, "/todos"); 
      navigate("/todos"); 
    }
  }, [navigate, setAccessToken]);

  return <p>Signing you in...</p>;
};

export default GoogleCallback;
