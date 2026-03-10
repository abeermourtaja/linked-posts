import axios from 'axios'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/authContext'
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from "date-fns";
import { useNavigate, useParams } from 'react-router-dom';
export default function UserPost({post}) {
    const navigate=useNavigate()
     const {mutate:comment,isPending:addCommentPending,}=useMutation({
        mutationKey:['comments'],
        mutationFn:async (data)=>{
            const formData=new FormData();
            formData.append('content',data.content)

                if (data.image && data.image[0]) {
                    formData.append('image', data.image[0]);
                }

            return await axios.post(`https://route-posts.routemisr.com/posts/${post._id}/comments`,formData,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
        },
        onSuccess:()=>{
            queryClient.invalidateQueries(['comments', post._id])
            queryClient.invalidateQueries(['posts'])
            reset()
            setImg(false)
            setImgPreview('')

        }
    })


    const {data:commentData,isPending:commentPending,isError}=useQuery({
        queryKey:['comments',post._id],
        queryFn:async()=>{
            return await axios.get(`https://route-posts.routemisr.com/posts/${post._id}/comments?page=1&limit=10`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }).then((res)=>res?.data)
        }
    });
    const comments=commentData?.data?.comments;
    const queryClient=useQueryClient();
    const [like,setLike]=useState(post?.likesCount);
    const token=localStorage.getItem('token')
    const {mutate,isPending}=useMutation({
        mutationFn:()=>{
            return axios.put(`https://route-posts.routemisr.com/posts/${post._id}/like`,{},{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
        },
        onSuccess:()=>{
            queryClient.invalidateQueries(["posts"]);

        }
    })
 
  return (
    <div className='bg-white rounded-2xl border-1 border-[#dadcdf]'>
      <div className="flex justify-between p-3">
        <div className="flex gap-3 items-center">
            <img className='rounded-full size-10' src={post?.user?.photo} alt="" />
            <div>
                <h3 className='font-extrabold text-sm'>{post?.user?.name}</h3>
                <p className='text-xs text-gray-500'>@{post?.user?.username} </p>
            </div>
        </div>
       <button onClick={()=>navigate(`/posts/${post?._id}`)} className='text-sm font-bold text-textPrimary p-2 hover:bg-background rounded-xl'>View details</button>
      </div>
        <p className='px-3 pb-3 text-sm'>{post?.body}</p>

        <div className="bg-black mx-auto d-flex justify-center items-center">
            <img className='m-auto w-1/2 h-1/2 object-contain' src={post?.image} alt="" />
        </div>
        <div className='flex justify-between items-center'>
            <div className="flex gap-3 p-3">
                <div className="like flex gap-2 items-center">
                    <i className="fa-regular fa-thumbs-up text-textPrimary "></i>
                    <p className='font-semibold text-sm text-[#62748e]'>{post?.likesCount} Likes</p>
                </div>
                <p className='font-semibold text-sm text-[#62748e] p-3'>{post?.sharesCount} shares</p>
                <p className='font-semibold text-sm text-[#62748e] p-3'>{post?.commentsCount} comments</p>
            </div>
            <p className='px-4 font-bold text-gray-400 text-sm'>{new Date(post?.createdAt).toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short'
            })}
            </p>
        </div>
        
       {post?.topComment && <div className="p-3">
            <div className="rounded-2xl border-1 border-border p-3 bg-[#f8fafc]">
                <p className='text-greyText font-bold'>Top Comment</p>
                <div className="flex gap-3 items-center mt-3">
                    <img className='rounded-full size-10' src={post?.topComment?.commentCreator?.photo} alt="" />
                    <div className='bg-white rounded-xl w-full p-2'>
                        <h3 className='font-extrabold text-sm'>{post?.topComment?.commentCreator?.name}</h3>
                        <p className='text-sm text-greyText'>{post?.topComment?.content}</p>
                    </div>
                </div>
                <button className='text-sm text-textPrimary font-bold hover:underline'>View all Comments</button>
            </div>
        </div>}
    </div>
  )
}
