import React from 'react';
import { useState, useEffect } from 'react';
import {
    Route,
    Redirect
} from "react-router-dom";
import {ACCESS_TOKEN} from "../constants";
import {jwt_reset} from "../util/APIUtils";
import jwt from 'jsonwebtoken';
import Profile from "../user/profile/Profile";
import LoadingIndicator  from './LoadingIndicator';


/*
async function temp_function(token){
    await localStorage.setItem(ACCESS_TOKEN,token).then(function () {
        return true;
    })
  }
  
  
  // jwt 검증 및 refresh 토큰 발행
  async function verify_jwt(){
    try{
    const token = localStorage.getItem(ACCESS_TOKEN)
    const decode = await jwt.verify(token, 'JWTSuperSecretKey')
    if(decode.userId) {return true;}
    else {return false;}
    }
    catch{
        await jwt_reset().then(response => { 
            return temp_function(response.accessToken) 
        }).catch(error => {return false;})
    }
  }

*/

const ProfileRoute = ({ isAuthenticated,currentUser, ...rest }) => {

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


    return (
        <Route path ="/users/:username"
        render={(props) =>
            ( isTokenValidated && isAuthenticated )?(
            <Profile isAuthenticated={isAuthenticated} currentUser={currentUser} {...props}  />
            ):(
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

export default ProfileRoute