import { Dispatch, SetStateAction, createContext, ReactNode, useState } from 'react';
import UserService from "../services/user.service";
import { UserSession } from '../types/user.type';

type AuthContextValues = {
    userSession: UserSession;
    setUserSession: Dispatch<SetStateAction<UserSession>>;
    isAuthenticated: boolean;
}

type Props = {
    children: ReactNode;
};

let authContextDefaultValues: AuthContextValues = {
    userSession: {token: ''},
    setUserSession: () => {},
    isAuthenticated: false,
}

export const AuthenticationContext= createContext(authContextDefaultValues);

export const AuthProvider = ({ children } : Props) => {
    const [userSession, setUserSession] = useState<UserSession>(authContextDefaultValues.userSession);

    const value = {
        userSession,
        setUserSession,
        isAuthenticated: UserService.isAuthenticate()
    }

    console.info("USER SESSION :::", userSession)

    UserService.setUserToken(userSession?.token);

    return (
        <AuthenticationContext.Provider value={value}>
            {children}
        </AuthenticationContext.Provider>
    )
}