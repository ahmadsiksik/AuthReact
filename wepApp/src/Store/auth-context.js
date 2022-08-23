import React, { createContext, useEffect, useState } from "react";

const AuthContext = createContext({
    token: '',
    IsLogin: false,
    login: (token) => { },
    logout: () => { },
});

const calculateRemainingTime = (expirationTime) => {
    const currentTime = new Date().getTime();
    const adjExpirationTime = new Date(expirationTime).getTime();
  
    const remainingDuration = adjExpirationTime - currentTime;
  
    return remainingDuration;
  };

  const retrieveStoredToken = () => {
    const storedToken = localStorage.getItem('token');
    const storedExpirationDate = localStorage.getItem('expirationTime');
  
    const remainingTime = calculateRemainingTime(storedExpirationDate);
  
    if (remainingTime <= 3600) {
      localStorage.removeItem('token');
      localStorage.removeItem('expirationTime');
      return null;
    }
  
    return {
      token: storedToken,
      duration: remainingTime,
    };
  };

  
export const AuthContextProvider = (props) => {
    let logoutTimer;
    const tokenData = retrieveStoredToken();
  
    let initialToken;
    if (tokenData) {
      initialToken = tokenData.token;
    }
  
    const [token, usetoken] = useState(initialToken);
    const UserIsLogin = !!token;


    const LogoutHandler = () =>{
        usetoken(null)
        localStorage.removeItem("token")
        localStorage.removeItem('expirationTime');
        if (logoutTimer) {
            clearTimeout(logoutTimer);
          }
    }

    const LoginHandler = (token,expirationTime) =>{
        usetoken(token)
        localStorage.setItem('token',token)
        localStorage.removeItem('expirationTime');

        const remainingTime = calculateRemainingTime(expirationTime);

        logoutTimer = setTimeout(LogoutHandler, remainingTime);
    

    }

    useEffect(() => {
        if (tokenData) {
          console.log(tokenData.duration);
          logoutTimer = setTimeout(LogoutHandler, tokenData.duration);
        }
      }, [tokenData, LogoutHandler]);


    const AuthValue={
        token: token,
        IsLogin: UserIsLogin,
        login:LoginHandler,
        logout:LogoutHandler ,
    }
    return (
        <AuthContext.Provider value={AuthValue}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContext;