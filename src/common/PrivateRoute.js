import React from 'react';
import { useState, useEffect } from 'react';
import {
    Route,
    Redirect
  } from "react-router-dom";
import {ACCESS_TOKEN} from "../constants";
import {jwt_reset} from "../util/APIUtils";
import jwt from 'jsonwebtoken';
import LoadingIndicator  from './LoadingIndicator';

/*
import React from 'react';
import {
    Route,
    Redirect
  } from "react-router-dom";
  
  
const PrivateRoute = ({ component: Component, authenticated, ...rest }) => (
    <Route
      {...rest}
      render={props =>
        authenticated ? (
          <Component {...rest} {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location }
            }}
          />
        )
      }
    />
);
  
export default PrivateRoute
*/


/* 8/7일 수정 사항 - 클래스 다시 선언 */
const PrivateRoute = ({ component: Component, authenticated, ...rest }) => {

  const [isTokenValidated, setIsTokenValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const asyncLocalStorage = {
      setItem: async function (key, value) {
          await null;
          return localStorage.setItem(key, value);
      },
      getItem: async function (key) {
          await null;
          return localStorage.getItem(key);
      }
  };


  // jwt 검증 및 refresh 토큰 발행
  useEffect(() => {
      async function tempfunc(){
      try{
        const token = await localStorage.getItem(ACCESS_TOKEN)
        const decode = await jwt.verify(token, new Buffer('JWTSuperSecretKey', 'base64'), { algorithms: ['HS512'] })
        if(decode.userId) {setIsTokenValidated(true);  setIsLoading(true);}
         else {setIsTokenValidated(false);setIsLoading(true);}
      }
      catch{
          await jwt_reset().then(response => { 
              asyncLocalStorage.setItem(ACCESS_TOKEN,response.accessToken).then(function () {
              setIsTokenValidated(true); setIsLoading(true); })
          }).catch(error => {setIsTokenValidated(false);setIsLoading(true);})
      }
      }
      tempfunc();
    },[])

  if(!isLoading){
    return <LoadingIndicator />;
  }



  return(
    <Route
      {...rest}
      render={props =>
        ( isTokenValidated && authenticated ) ? (
          <Component {...rest} {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location }
            }}
          />
        )
      }
    />
  )

}

export default PrivateRoute