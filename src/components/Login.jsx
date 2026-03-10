import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginSchema } from '../schema/loginSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { AuthContext } from '../context/authContext';

export default function Login() {
  const {setToken}=useContext(AuthContext);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const {register,handleSubmit,formState:{errors}}=useForm({
      defaultValues:{
        email:'',
        password:'',
      },
    resolver:zodResolver(loginSchema),
  });
  const navigate=useNavigate();
 function handleLogin(data){
    setLoading(true);
    setError('');
    axios.post('https://route-posts.routemisr.com/users/signin',data).then((res)=>{
      setToken(res?.data?.data?.token);
      localStorage.setItem('token',res?.data?.data?.token);
      setLoading(false);
      setError(''); 
      navigate('/feed');
    }).catch((err)=>{
      console.log(err);
      setLoading(false);
      setError(err.response.data.message);
    });
 }

  return (
    <div>
        <div className="my-7 ">
            <h3 className='font-extrabold text-2xl'>Log in to Route Posts</h3>
            <p className='text-sm text-gray-500 my-1'>Log in and continue your social journey.</p>
        </div>
        <form className='flex flex-col gap-4'>
            <div className="relative">
                <i className='fa-solid fa-user absolute top-5 left-3 text-[#8fa0b8]'></i>
                <input {...register('email')} className='pl-10 rounded-xl p-3 bg-[#f8fafc] border-1 border-[#e2e8f0] w-full'  type="text" placeholder="Email or Username" />
                {errors?.email && <p className='text-danger '>{errors.email.message}</p>}
            </div>
            <div className="relative">
                <i className='fa-solid fa-key absolute top-5 left-3 text-[#8fa0b8]'></i>
                <input {...register('password')}  className='pl-10 rounded-xl p-3 bg-[#f8fafc] border-1 border-[#e2e8f0] w-full' type="password" placeholder="Password" />
                {errors?.password && <p className='text-danger '>{errors.password.message}</p>}
            </div>
            <button onClick={handleSubmit(handleLogin)} className='bg-primaryapp text-white rounded-xl p-3 font-bold mt-4'>{loading?'please wait...':'Log in'}</button>
            <Link className='text-center text-primaryapp'>Forgot Password?</Link>
            {error && <div className='my-3 p-3 rounded-xl border-1 bg-[#fff1f2] border-[#ffccd3]'>
              <p className='text-danger text-center'>{error}</p>
            </div>
            }
         </form>
    </div>
  )
}
  
