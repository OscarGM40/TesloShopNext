import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { FC, useEffect, useReducer } from 'react';
import { tesloApi } from '../../api';
import { IUser } from '../../interfaces';
import { AuthContext, authReducer } from './';
import { signOut, useSession } from 'next-auth/react';

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);
  const router = useRouter();
  const { data, status } = useSession();

/*   useEffect(() => {
    checkToken();
  }, []); */

  useEffect(() => {
    if(status === 'authenticated'){
      // console.log(data.user)
      dispatch({ type: '[Auth] - Login', payload: data.user as IUser });
    }
  },[status,data])

  const checkToken = async (): Promise<boolean> => {
    // si no hay un token para que mirar más?
    if (!Cookies.get('token')) {
      return false;
    }
    try {
      // llamar endpoint
      const { data } = await tesloApi.get('/user/validate-token');
      const { token, user } = data;
      // guardar nuevo token en cookies
      Cookies.set('token', token);
      // disparar login de nuevo
      dispatch({ type: '[Auth] - Login', payload: user });
      return true;
    } catch (error) {
      // si algo sale mal borrar el token de las cookies
      Cookies.remove('token');
      return false;
    }
  };

  const loginUser = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const { data } = await tesloApi.post('/user/login', { email, password });
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: '[Auth] - Login', payload: user });
      return true;
    } catch (error) {
      return false;
    }
  };

  const registerUser = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ hasError: boolean; message?: string }> => {
    try {
      const { data } = await tesloApi.post('/user/register', {
        name,
        email,
        password,
      });
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: '[Auth] - Login', payload: user });
      return {
        hasError: false,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          hasError: true,
          message: (error.response?.data as { message: string }).message,
        };
      }
      return {
        hasError: true,
        message: 'No se pudo registrar el usuario.Intentelo de nuevo',
      };
    }
  };

  const logoutUser = () => {
    Cookies.remove('cart');
    Cookies.remove('firstName');
    Cookies.remove('lastName');
    Cookies.remove('address');
    Cookies.remove('address2');
    Cookies.remove('zip');
    Cookies.remove('city');
    Cookies.remove('country');
    Cookies.remove('phone');
    signOut()
    /* router.reload();
    Cookies.remove('token'); */
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        // methods
        loginUser,
        registerUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
