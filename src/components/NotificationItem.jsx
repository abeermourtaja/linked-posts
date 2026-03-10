import React from 'react'

export default function NotificationItem({notification}) {
  const {actor}=notification;
  return (
    <div className="rounded-xl w-full border-1 border-border p-2 flex justify-between items-center">
        <div className='flex gap-4'>
          <img className='size-10 rounded-full' src={actor?.photo} alt="" />
          <div className="flex flex-col gap-1">
            <h1>{actor?.name}<span className='font-medium text-xs text-greyText'> {notification?.type}</span></h1>
            <p className='text-xs'>Read</p>
          </div>
        </div>
        <p>7h</p>
      </div>
  )
}
