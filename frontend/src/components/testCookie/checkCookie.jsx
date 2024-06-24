import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const URIAccount = `${import.meta.env.VITE_BACKENDURL}`;
const TestCookie = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkCookie = async () => {
      try {
        
        const response = await fetch(`${URIAccount}/check-cookie`, {

          method: "GET",
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (response.ok) {
          navigate("/dashboard");
          console.log('Erfolgreich eingeloggt');
        } else {
          navigate("/");
          console.error('Fehler beim Einloggen:', response.statusText);
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkCookie();
  }, []);

  return null; 
};

export default TestCookie;
