import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function SuggestedFriend({suggestion}) {
    const navigate=useNavigate();
    const queryClinet=useQueryClient()
    const token=localStorage.getItem('token')
    const {mutate,isPending}=useMutation({
        mutationKey:['followSuggestion'],
        mutationFn:()=>{
            return axios.put(`https://route-posts.routemisr.com/users/${suggestion._id}/follow`,{},{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
        },
        onSuccess:()=>{
            queryClinet.invalidateQueries(['posts'],['followSuggestion'],['user'])
        }
    })
  return (
    <div className='flex flex-col gap-3 rounded-xl border-1 border-border p-4 '>
      <div className="flex gap-1 justify-between items-start">
        <button onClick={()=>navigate(`/profile/${suggestion._id}`)} className="flex gap-2 ">
            <img src={suggestion?.photo} className="rounded-full size-10 "/>
            <div className="flex flex-col">
                <h1 className='text-sm'>{suggestion?.name} </h1>
                <p className="text-greyText text-xs ">{`@${suggestion?.username?? 'route user'}`}</p>
            </div>
        </button>
        <button onClick={()=>mutate()}   disabled={isPending} className='bg-background font-bold text-textPrimary rounded-2xl p-1 my-0 flex justify-center items-center text-sm gap-1'>
            <i className='fa-solid fa-user-plus fa-xs'></i>
            {isPending?'updating...':'Follow'}
        </button>
      </div>
      <div className="flex gap-3">
        <div className='bg-background text-greyText text-[11px] rounded-2xl p-1 my-0 flex justify-center items-center text-sm gap-1 font-bold'>
            {suggestion?.followersCount} followers
        </div>
        <div className='bg-background text-textPrimary text-[11px] rounded-2xl p-1 my-0 flex justify-center items-center text-sm gap-1 font-bold'>
            {suggestion?.mutualFollowersCount} mutual
        </div>
      </div>
    </div>
  )
}
