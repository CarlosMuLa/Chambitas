import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

export const useCurrentUser = () => {
  const { idToken } = useAuth();

  if (!idToken) return null;

  try {
    // Decodificamos el token
    const decoded: any = jwtDecode(idToken);
    
    // Cognito guarda el usuario en 'username' o 'cognito:username'
    return {
      username: decoded.username || decoded["cognito:username"],
      sub: decoded.sub, // El ID único (importante para tu DB)
      // El AccessToken de Cognito NO suele traer el email. 
      // Si necesitas el email, tendrías que guardar el ID Token en lugar del Access Token
      // o hacer una llamada extra a Cognito.
      email: decoded.email,
      picture: decoded.picture,// Si tienes un atributo personalizado para la foto
      type: decoded["custom:type"] ,// Si tienes un atributo personalizado para el tipo de usuario

    };
  } catch (error) {
    console.error("Error al decodificar token:", error);
    return null;
  }
};