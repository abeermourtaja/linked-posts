import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import PostItem from '../components/PostItem';

export default function PostPage() {
    const {postId}=useParams();
    const token=localStorage.getItem('token')
    const navigate=useNavigate();
    const {data,isLoading,isError}=useQuery({
        queryKey:['post',postId],
        queryFn:async()=>{
            const res= await axios.get(`https://route-posts.routemisr.com/posts/${postId}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            return res?.data;
        }
    })
    const post=data?.data?.post;
    if (isLoading) return <p>Loading post...</p>;
    if (isError || !post) return <p>Post not found</p>;

  return (
    <div className='w-1/2 mx-auto py-25 '>
        <button onClick={()=>{navigate(-1)}} className="flex rounded-xl border-1 border-border gap-2 font-bold items-center p-2 bg-white my-3 text-bold text-medium">
            <i className='fa-solid fa-arrow-left'></i>
            Back
        </button>
        <PostItem post={post} ></PostItem>
    </div>
  )
}
