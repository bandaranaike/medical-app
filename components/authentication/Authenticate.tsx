import React from "react";
import LoginWindow from "@/components/authentication/LoginWindow";
import {LoggedUser} from "@/types/interfaces";
import {useUserContext} from "@/contexts/UserContext";


const Authenticate: React.FC<{ onLoginStatusChange: (loggedUser: LoggedUser) => void }> = ({onLoginStatusChange}) => {

    const {setUser} = useUserContext();

    const setLoggedUserDataInCookies = (loggedUser: LoggedUser) => {
        setUser(loggedUser);
        onLoginStatusChange(loggedUser);
    };

    return (
        <LoginWindow onUserHasLoggedIn={setLoggedUserDataInCookies}/>
    );
};

export default Authenticate;
