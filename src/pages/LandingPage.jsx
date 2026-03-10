
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Login from '../components/Login'
import Register from '../components/register'

export default function LandingPage() {
    let [login,setLogin]= useState(true);
    function openLogin(){
        setLogin(true);
    }
    function openLogin(){
        setLogin(true);
    }
    function openRegister(){
        setLogin(false);
    }
  return (
    <div className="container w-3/4 flex m-auto gap-35 items-center ">
        <div className="flex-col w-[59%] justify-center items-center py-25 ">
            <h1 className='text-6xl text-primaryapp font-extrabold my-4 tracking-[-1.5px]'> Route Posts</h1>
            <p className='text-2xl font-medium my-4'>Connect with friends and the world around you on Route Posts.</p>
            <div className="info-card rounded-2xl border-1 border-[#c9d5ff] p-6 bg-white shadow mt-5">
                <h4 className='tracking-[2px] text-primaryapp font-extrabold '>About Route Academy</h4>
                <h3 className='text-lg mb-3'>Egypt's Leading IT Training Center Since 2012</h3>
                <p className='text-sm text-gray-700'>Route Academy is the premier IT training center in Egypt, established in 2012. We specialize in delivering high-quality training courses in programming, web development, and application development. We've identified the unique challenges people may face when learning new technology and made efforts to provide strategies to overcome them.</p>
                <div className="flex flex-wrap gap-2 mt-6">
                    <div className="w-[31%] h-14.5 d-flex flex-column justify-center items-start rounded-2xl border-1 border-[#c9d5ff] p-3 bg-[#f2f6ff]">
                        <h6 className='text-primaryapp font-extrabold'>2012</h6>
                        <p className='text-nowrap text-[11px] font-bold text-gray-600'>Founded</p>
                    </div>
                    <div className="w-[31%] h-14.5 d-flex flex-column justify-center items-start rounded-2xl border-1 border-[#c9d5ff] p-3 bg-[#f2f6ff]">
                        <h6 className='text-primaryapp font-extrabold'>40K+</h6>
                        <p className='text-nowrap text-[11px] font-bold text-gray-600'>Graduates</p>
                    </div>
                    <div className="w-[31%] h-14.5 d-flex flex-column justify-center items-start rounded-2xl border-1 border-[#c9d5ff] p-3 bg-[#f2f6ff]">
                        <h6 className='text-primaryapp font-extrabold'>50+</h6>
                        <p className='text-nowrap text-[11px] font-bold text-gray-600'>Partner Companies</p>
                    </div>
                    <div className="w-[31%] h-14.5 d-flex flex-column justify-center items-start rounded-2xl border-1 border-[#c9d5ff] p-3 bg-[#f2f6ff]">
                        <h6 className='text-primaryapp font-extrabold'>5</h6>
                        <p className='text-nowrap text-[11px] font-bold text-gray-600'>Branches</p>
                    </div>
                    <div className="w-[31%] h-14.5 d-flex flex-column justify-center items-start rounded-2xl border-1 border-[#c9d5ff] p-3 bg-[#f2f6ff]">
                        <h6 className='text-primaryapp font-extrabold'>20</h6>
                        <p className='text-nowrap text-[11px] font-bold text-gray-600'>Diplomas Available</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="w-[40%] bg-white rounded-xl p-6 my-20">
            <div className={`flex  bg-[#f1f5f9] rounded-xl p-1`}>
                <button onClick={openLogin} className={`${login?'text-primaryapp bg-white':'text-[#45556c]'} text-sm w-1/2 font-bold p-3 rounded-lg `}>Login</button>
                <button onClick={openRegister} className={`${!login?'text-primaryapp bg-white':'text-[#45556c]'} text-sm w-1/2 font-bold p-3 rounded-lg `}>Register</button>
            </div>
            {login?<Login/>:<Register/>}
        </div>
    </div>
  )
}
