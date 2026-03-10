import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { registerSchema } from '../schema/registerSchema';
import { AuthContext } from '../context/authContext';

export default function Register() {
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState('');
    const navigate=useNavigate();
    const {setToken}=useContext(AuthContext);
    const {register,handleSubmit,formState:{errors}}=useForm(
    {
      defaultValues:{
        name:'',
        username:'',
        email:'',
        gender:'',
        dateOfBirth:'',
        password:'',
        rePassword:'',
    },
    resolver:zodResolver(registerSchema),
  });
  function handleRegister(data){
    setLoading(true);
    setError('');
      axios.post('https://route-posts.routemisr.com/users/signup',data).then((res)=>{
        console.log(res);
        setLoading(false);
        setError('');
        setToken(res?.data?.data?.token)
        localStorage.setItem('token',res?.data?.data?.token);
        navigate('/feed');
      }).catch((err)=>{
        setLoading(false);
        setError(err.response.data.message);
        console.log(err);
      });
  }
  return (
   <div>
      <div className="my-7">
          <h3 className='font-extrabold text-2xl'>Create a new account</h3>
          <p className='text-sm text-gray-500 my-1'>It is quick and easy.</p>
      </div>
      <form className='flex flex-col gap-4'>
          <div className="relative">
              <i className='fa-regular fa-user absolute top-5 left-3 text-[#8fa0b8]'></i>
              <input {...register('name')} className='pl-10 rounded-xl p-3 bg-[#f8fafc] border-1 border-[#e2e8f0] w-full'  type="text" placeholder="Full name" />
              {errors?.name && <p className='text-danger '>{errors.name.message}</p>}
          </div>
          <div className="relative">
              <i className='fa-solid fa-at absolute top-5 left-3 text-[#8fa0b8]'></i>
              <input {...register('username')} className='pl-10 rounded-xl p-3 bg-[#f8fafc] border-1 border-[#e2e8f0] w-full' type="text" placeholder="Username (optional)" />
              {errors?.username && <p className='text-danger '>{errors.username.message}</p>}
          </div>
          <div className="relative">
              <i className='fa-solid fa-at absolute top-5 left-3 text-[#8fa0b8]'></i>
              <input {...register('email')} className='pl-10 rounded-xl p-3 bg-[#f8fafc] border-1 border-[#e2e8f0] w-full' type="email" placeholder="Email Address" />
              {errors?.email && <p className='text-danger '>{errors.email.message}</p>}
          </div>
          <div className="relative">
              <i className='fa-solid fa-user-group absolute top-5 left-3 text-[#8fa0b8]'></i>
              <select {...register('gender')} className='pl-10 rounded-xl p-3 bg-[#f8fafc] border-1 border-[#e2e8f0] w-full' >
                <option value="" selected>Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors?.gender && <p className='text-danger'>{errors.gender.message}</p>}
                  
          </div>
          <div className="relative">
              <i className='fa-regular fa-calendar absolute top-5 left-3 text-[#8fa0b8]'></i>
              <input {...register('dateOfBirth')} className='pl-10 rounded-xl p-3 bg-[#f8fafc] border-1 border-[#e2e8f0] w-full' type="date"  />
              {errors?.dateOfBirth && <p className='text-danger '>{errors.dateOfBirth.message}</p>}
          </div>
          <div className="relative">
              <i className='fa-solid fa-key absolute top-5 left-3 text-[#8fa0b8]'></i>
              <input {...register('password')} className='pl-10 rounded-xl p-3 bg-[#f8fafc] border-1 border-[#e2e8f0] w-full' type="password" placeholder="Password" />
              {errors?.password && <p className='text-danger '>{errors.password.message}</p>}
          </div>
          <div className="relative">
              <i className='fa-solid fa-key absolute top-5 left-3 text-[#8fa0b8]'></i>
              <input {...register('rePassword')} className='pl-10 rounded-xl p-3 bg-[#f8fafc] border-1 border-[#e2e8f0] w-full' type="password" placeholder="Confirm Password" />
              {errors?.rePassword && <p className='text-danger'>{errors.rePassword.message}</p>}
          </div>
          <button onClick={handleSubmit(handleRegister)} className='bg-primaryapp text-white rounded-xl p-3 font-bold mt-4 '>{loading?'please wait...':'Create New Account'}</button>
          {error && <div className='my-3 p-3 rounded-xl border-1 bg-[#fff1f2] border-[#ffccd3]'>
              <p className='text-danger text-center'>{error}</p>
            </div>
          }
      </form>
  </div>
  )
}
