
import React, { useContext, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/authContext';

export default function Navbar() {
  const {token,setToken}=useContext(AuthContext)
  const [settings,isSettings]=useState(false);
  const navigate=useNavigate();
  const {user}=useContext(AuthContext);
  function handleShowSettings(){
    isSettings(prev => !prev);
  }
  function handleLogout(){
    localStorage.removeItem('token');
    setToken(null)
    navigate('/auth')
  }
  return (
    
<nav className="bg-white fixed w-full z-20 top-0  border-b border-default">
  <div className="max-w-screen-xl flex items-center justify-between mx-auto p-2">
    <a className="flex items-center space-x-3 ">
      <img src='../src/assets/route.png' className="h-9 rounded-xl" alt="route posts" />
      <span className="self-center text-xl text-heading whitespace-nowrap font-extrabold">Route Posts</span>
    </a>
    <div className="items-center justify-between" id="navbar-sticky">
      <ul className="flex flex-col mt-4 font-medium rounded-base bg-neutral-secondary-soft md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:bg-neutral-primary bg-[#f8fafc] border-1 border-[#e2e8f0] rounded-xl p-3 ">
        <li className="flex group text-gray-600 gap-1 items-center ">
            <i className="fa-regular fa-house group-focus-within:text-textPrimary "></i>
            <NavLink to={'/feed'} className=" block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent font-extrabold text-sm focus-within:text-textPrimary group">Feed</NavLink>
        </li>
        <li className="flex group text-gray-600 gap-1 items-center focus:text-textPrimary">
            <i className="fa-regular fa-user group-focus-within:text-textPrimary"></i>
          <NavLink to={'/profile'} className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent font-extrabold text-sm focus-within:text-textPrimary  text-gray-600 ">Profile</NavLink>
        </li>
        <li className="flex group text-gray-600 gap-1 items-center focus-within:text-textPrimary">
            <i className="fa-regular fa-comment group-focus-within:text-textPrimary"></i>
          <NavLink to={'/notifications'} className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent font-extrabold text-sm focus-within:text-textPrimary  text-gray-600 ">Notifications</NavLink>
        </li>
      </ul>
    </div>
    <div>
      <button onClick={handleShowSettings} className='p-3 rounded-3xl  bg-[#f8fafc] border-1 border-[#e2e8f0] flex items-center gap-2'>
        <img className='size-8' src={user?.photo} alt="" />
        {user?.name}
        <i className="fa-solid fa-bars text-[#62748e]"></i>
      </button>
      {settings && <div className='w-50 bg-white rounded-xl flex flex-col border-border border-1 p-3 gap-1 my-3 absolute'>
        <button onClick={()=>{navigate('/profile'); isSettings(false)}} className='flex gap-3 items-center p-2 rounded-xl hover:bg-background font-semibold text-greyText'>
          <i className='fa-regular fa-user'></i>
          Profile
        </button>
        <button className='flex gap-3 items-center p-2 rounded-xl hover:bg-background font-semibold text-greyText'>
          <i className='fa-solid fa-gear'></i>
          Settings
        </button>
        <hr className='text-borer border-none h-0.25 bg-border'/>
        <button onClick={handleLogout} className='flex gap-3 items-center text-danger p-2 rounded-xl hover:bg-danger-50 font-semibold '>
          Logout
        </button>
      </div>}
    </div>
  </div>
</nav>


  )
}
