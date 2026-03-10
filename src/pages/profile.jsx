import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios';
import React, { useState } from 'react'
import PostItem from '../components/PostItem';
import UserPost from '../components/UserPost';
import { useNavigate, useParams } from 'react-router-dom';
import { button } from '@heroui/react';

export default function Profile() {
  const queryClinet=useQueryClient();
  const navigate=useNavigate();
  const { id } = useParams();
  const [saveBtn,setSaveBtn]=useState(false);
  const [postsBtn,setpostsBtn]=useState(true);
  const token=localStorage.getItem('token')
  const {data:userData,error:userError,isPending:isPendingUser}=useQuery({
    queryKey:['user',id],
    queryFn:async ()=>{
      const url= !id?`https://route-posts.routemisr.com/users/profile-data`:`https://route-posts.routemisr.com/users/${id}/profile`
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      return res?.data;
    },
  });
  const {data:savedPostsData,isPending:pendingSavedPosts}=useQuery({
    queryKey:['bookmarks'],
    queryFn: async () =>{
      const res=await axios.get(`https://route-posts.routemisr.com/users/bookmarks`,{
            headers:{
              Authorization:`Bearer ${token}`
            }
          });
          return res?.data;
        }
  })
  const bookmarks=savedPostsData?.data?.bookmarks;
  const {mutate,isPending,isSuccess}=useMutation({
        mutationKey:['followSuggestion'],
        mutationFn:()=>{
            return axios.put(`https://route-posts.routemisr.com/users/${id}/follow`,{},{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
        },
        onSuccess:()=>{
            queryClinet.invalidateQueries(['posts'])
            queryClinet.invalidateQueries(['followSuggestion'])
            queryClinet.invalidateQueries(['user'])
            console.log('hello')
        },
        onError:()=>{
          console.log('hello')
        }
    })
  const user=userData?.data?.user;
  const isFollowing=userData?.data?.isFollowing;
  const {data:postData,error:postError,isPending:isPendingPost}=useQuery({
    queryKey:['posts'],
    queryFn:async ()=>{
      const res =await axios.get(`https://route-posts.routemisr.com/users/${user._id}/posts`,{
        headers:{
          Authorization:`Bearer ${token}`
        },
      });
      return res?.data;
    }
  })
  const posts=postData?.data?.posts;
  return (
    <div className='max-w-screen-xl mx-auto p-4  mt-20'>
      <button onClick={()=>{navigate('/feed')}} className="flex rounded-xl border-1 border-border gap-2 font-bold items-center p-2 bg-white my-3 text-bold text-medium">
          <i className='fa-solid fa-arrow-left'></i>
          Back
      </button>
      <div className="w-full rounded-2xl border-border relative">
        <img className={`w-full h-[250px] object-center object-cover rounded-t-2xl bg-blue`} src={user?.cover} alt="" />
        <div className={`w-full  ${id?'h-[100px]':'h-[300px]'} bg-white rounded-b-2xl d-flex gap-4`}></div>
        <div className={`top-40 left-15 absolute bg-white  ${id?'h-[100px]':'h-[200px]'} p-5 rounded-2xl mx-auto w-9/10 flex-col gap-3`}>
            
          <div className=' justify-between flex items-center my-3 '>
            <div className="flex gap-4 items-center">
            <div className='rounded-full size-30 border-3 bg-grey border-white outline-2 outline-[#dbeafe] overflow-hidden flex items-center justify-center'>
              <img className='size-29 p-2' src={user?.photo} alt="" />
            </div>
            <div className='flex flex-col items-start'>
              <h1 className='font-black text-4xl'>{user?.name}</h1>
              <p className='font-semibold text-xl text-[#62748e]'>@{user?.username??'user'}</p>
              <div className="rounded-3xl px-3 my-1 border-1 border-border text-textPrimary text-sm font-bold bg-[#eef6ff]">Route Posts member</div>
            </div>

          </div>
          {!id?<div className="flex gap-4 justify-center items-center">
            <div className="rounded-xl border-border border-1 bg-white px-10 py-4">
              <p className="text-greyText font-bold">Followers</p>
              <h1 className='text-center font-black text-3xl'>{user?.followersCount}</h1>
            </div>
            <div className="rounded-xl border-border border-1 bg-white px-10 py-4">
              <p className="text-greyText font-bold">Followings</p>
              <h1 className='text-center font-black text-3xl'>{user?.followingCount}</h1>
            </div>
            <div className="rounded-xl border-border border-1 bg-white px-10 py-4">
              <p className="text-greyText font-bold">Bookmarks</p>
              <h1 className='text-center font-black text-3xl'>{user?.bookmarksCount}</h1>
            </div>
          </div>:
          <button disabled={isPending} onClick={()=>mutate()} className={
            `${isFollowing?'bg-white border-1 border-border text-greyText ':'bg-textPrimary text-white'} p-2 text-sm rounded-lg font-bold  flex gap-2 items-center`}>
               {isPending?
               <><i className='fa-solid fa-spinner '></i>Loading...</>
               :<><i className={isFollowing?'fa-solid fa-check':'fa-solid fa-user-plus'}></i> {isFollowing?'Following':'Follow'}</>
              }</button>
            }</div>
          {!id && <div className="flex gap-3">
            <div className="w-7/10 rounded-xl border-border border-1 bg-[#f8fafc] p-3 pb-7">
              <div className="flex-col flex">
                <h3 className='my-2'>About</h3>
                <p className='text-greyText text-sm my-2'>{user?.email}</p>
                <p className='text-greyText text-sm'>Active on Route Posts</p>
              </div>
            </div>
            <div className="w-3/10 flex-col gap-4">
              <div className="rounded-xl border-border border-1 bg-[#f8fafc] p-3 ">
                <h2 className="text-primaryapp ">My posts</h2>
                <p className="font-black text-2xl">{posts?.length}</p>
              </div>
              <div className="rounded-xl border-border border-1 bg-[#f8fafc] p-3 mt-3 ">
                <h2 className="text-primaryapp ">Saved posts</h2>
                <p className="font-black text-2xl">{user?.bookmarksCount}</p>
              </div>
            </div>
          </div>}
        </div>
        {!id && <div className='bg-white rounded-xl flex justify-between items-center my-3'>
          <div className=" bg-white rounded-xl px-6 my-3">
            <div className='flex bg-[#f1f5f9] rounded-xl p-2 gap-4 '>
                <button onClick={()=>{setSaveBtn(false); setpostsBtn(true)} } className={`${postsBtn?'text-primaryapp bg-white':'text-[#45556c]'} text-sm  font-bold p-2 rounded-lg flex justify-ceneter items-center g2`}>
                  <i className='fa-regular fa-file-lines'></i>
                  My Posts
                </button>
                <button onClick={()=>{setSaveBtn(true); setpostsBtn(false)}}  className={`${saveBtn?'text-primaryapp bg-white':'text-[#45556c]'} text-sm font-bold p-2 rounded-lg flex justify-ceneter items-center gap-1`}>
                  <i className='fa-regular fa-bookmark'></i>
                  Saved
                </button>
            </div>
          </div>
          <div className='rounded-2xl bg-[#e7f3ff] me-3 p-1'>
            <h1 className='p-1 text-textPrimary'>2</h1>
          </div>    
        </div>}
        <div className="flex flex-col gap-4 my-2">
          {!saveBtn? posts?.map((post)=>{
            return !id? <UserPost post={post}></UserPost>:<PostItem post={post}> </PostItem>
          }):bookmarks?.map((post)=>{
            return !id? <UserPost post={post}></UserPost>:<PostItem post={post}> </PostItem>
          })}
        </div>
      </div>
    </div>
  )
}
