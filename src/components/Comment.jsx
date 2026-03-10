import { formatDistanceToNow } from 'date-fns'
import React from 'react'

export default function Comment({comment}) {
  return (
    <div className='p-1 flex items-start gap-4'>
        <img src={comment?.commentCreator?.photo} alt="" className="rounded-full size-10" />
        <div className="flex flex-col gap-3">
            <div className="flex flex-col bg-[#f0f2f5] p-2 gap-1 rounded-xl">
                <h1>{comment?.commentCreator?.name}</h1>
                <p className='text-greyText text-sm flex gap-2'>@{comment?.commentCreator?.username}. <span> {formatDistanceToNow(new Date(comment?.createdAt), {
                        addSuffix: true
                    })}</span></p>
                <p>{comment?.content}</p>
                {comment?.image && <img className='rounded-xl size-50' src={comment?.image} alt="" />}
            </div>
            <div className="flex gap-3 text-greyText text-sm font-bold">
                <h5 className='text-gray-400'>
                    {formatDistanceToNow(new Date(comment?.createdAt), {
                        addSuffix: true
                    })} </h5>
                <button className='hover:underline'>{`Like (${comment?.likes?.length})`}</button>
                <button className='hover:underline hover:text-textPrimary'>{`Reply (${comment?.repliesCount})`}</button>
            </div>
        </div>
    </div>
    
  )
}
