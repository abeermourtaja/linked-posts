import React from 'react'
import NotificationItem from '../components/NotificationItem'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function Notification() {
  const token=localStorage.getItem('token')
  const {data,isPending}=useQuery({
    queryKey:['notifications'],
    queryFn:async ()=>{
      const res=await axios.get(`https://route-posts.routemisr.com/notifications`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    )
      return res?.data;
  }
    
  })
  const notifications=data?.data?.notifications;
  return (
   <div className='pt-10'>
     <div className='max-w-screen-xl mx-auto borer-1 border-border rounded-xl bg-white mt-20  '>
      <div className="flex gap-3 flex-col p-4 ">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className='font-extrabold text-2xl'>Notifications</h1>
            <p>Realtime updates for likes, comments, shares, and follows.</p>
          </div>
          <button className=' border-1 border-border rounded-xl p-2 font-xs text-greyText font-bold' >Mark all as read</button>
          
        </div>
        <div className="flex justify-start items-center gap-3">
            <button className='rounded-xl px-4 text-white bg-primaryapp p-2'>All</button>
            <button className='rounded-xl p-2 bg-backgroundDefault'>Unread</button>
          </div>
          <hr className='text-border  h-1'/>
          {
            notifications? notifications?.map((notification)=>{
              return <NotificationItem notification={notification} key={notification._id}></NotificationItem>

            }):    <div className="rounded-xl w-full border-1 border-border p-4 text-greyText  flex justify-center font-extrabold  items-center bg-backgroundDefault">No Notification yet</div>
          }
      </div>
    </div>
   </div>
  )
}
