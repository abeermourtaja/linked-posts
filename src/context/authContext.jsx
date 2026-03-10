import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { createContext,  useEffect,  useState } from 'react'
export const AuthContext=createContext();
export default function AuthContextProvider({children}) {
    const [token,setToken]=useState(localStorage.getItem("token"));
    const [user,setUser]=useState(null);
    function handleAuth(){
        if(localStorage.getItem('token')){
            setToken(localStorage.getItem('token'));
        }
    }
    const {data:userData,error:userError,isPending:isPendingUser}=useQuery({
    queryKey:['user'],
    queryFn:async ()=>{
      const url= `https://route-posts.routemisr.com/users/profile-data`
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      return res?.data;
    },
  });
  useEffect(() => {
    if (userData) {
      setUser(userData?.data?.user);
    }
  }, [userData]);
  return (
    <AuthContext.Provider value={{token,setToken,user}}>
        {children}
    </AuthContext.Provider>
  )
}
