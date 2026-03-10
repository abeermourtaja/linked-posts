import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react'
import SuggestedFriend from '../components/SuggestedFriend';
import { useNavigate } from 'react-router-dom';

export default function Suggestions() {
    const navigate=useNavigate();
    const token=localStorage.getItem('token');
    const {data:followSuggestion,fetchNextPage,hasNextPage,isFetchingNextPage}=useInfiniteQuery({
    queryKey:['followSuggestions'],
    queryFn:async ({pageParam=1})=>{
        const res= await axios.get(`https://route-posts.routemisr.com/users/suggestions?page=${pageParam}&limit=20`,{
            headers:{
            Authorization:(`Bearer ${token}`)
        }
        });

        return res.data
        },

        getNextPageParam: (lastPage, pages) => {
            if (lastPage.data.suggestions.length === 0) return undefined;
            return pages.length + 1;
        }

    })
const suggestions=  followSuggestion?.pages?.flatMap(page => page.data.suggestions) || [];
  return (
    <div className='my-20 p-3 w-full m-auto max-w-screen-xl '>
        <button onClick={()=>navigate('/feed')} className="my-3 p-2 border-1 border-border rounded-xl bg-white font-bold">
            <i className='fa-solid fa-angle-left'></i>
            Back to Feed
        </button>
      <div className="p-4 border-border border-1 rounded-xl bg-white sticky top-20 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="flex gap-3 items-center">
                  <i className='fa-solid fa-user-group text-textPrimary'></i>
                  <h3 className='font-extrabold'>Suggested Friends </h3>
                </div>
                <div className='bg-gray-100 px-2 rounded-full'>
                  <h3>{suggestions?.length}</h3>
                </div>
              </div>
              <div className="my-3 flex flex-wrap gap-4">
                <input className='rounded-xl px-3 py-1 w-full bg-whiter border-1 border-border bg-[#f8fafc]' type="search"placeholder='Search friends...' />
                {suggestions?.map((suggestion)=>{
                  return <div key={suggestion._id} className='w-[49%]'><SuggestedFriend suggestion={suggestion}  ></SuggestedFriend></div>
                })}
                <button  disabled={isFetchingNextPage} onClick={ () => fetchNextPage()} className="rounded-xl bg-backgroundDefault p-2 w-full text-greyText font-bold border-1 border-border">{isFetchingNextPage?'Loading more...':'Load more users'}</button>
              </div>
      
            </div>
    </div>
  )
}
