import React, { useContext, useState } from 'react'
import PostItem from '../components/PostItem'
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { useForm, useWatch, Watch } from 'react-hook-form';
import SuggestedFriend from '../components/SuggestedFriend';
import { AuthContext } from '../context/authContext';

export default function Feed() {
  const {user}=useContext(AuthContext);
  const navigate=useNavigate();
  const queryClinet=useQueryClient();
  const token=localStorage.getItem('token');
  const [img,setImg]=useState(false);
  const [imgPreview,setImgPreview]=useState('')
  const [type,setType]=useState('feed');
  const {register,handleSubmit,reset}=useForm({
    defaultValues:{
      body:'',
    }
  })
  const {data:followSuggestion}=useQuery({
    queryKey:['followSuggestion'],
    queryFn:async ()=>{
      const res= await axios.get(`https://route-posts.routemisr.com/users/suggestions?limit=10`,{
        headers:{
          Authorization:(`Bearer ${token}`)
        }
      });
      return res.data
    }
  })
  const suggestions=followSuggestion?.data?.suggestions;
  const queryMap={
    'feed':getFeedPosts,
    'community':getPosts,
    'myPosts':getMyPost,
    'bookmarks':getBookmarks,
  }
  const {mutate,isError,isPending}=useMutation({
    mutationKey:['posts'],
    mutationFn:async(data)=>{
      const formData=new FormData()
      formData.append('body',data.body);
      if(data?.image?.length){
        formData.append('image',data?.image[0])
      }
      return await axios.post(`https://route-posts.routemisr.com/posts`,formData,{
        headers:{
          Authorization: `Bearer ${token}`
        }}).then((res)=>{
          setImgPreview('')
          setImg(false)
          console.log(res?.data)
        }).catch((err)=>{
          setImgPreview('')
          setImg(false)
          console.log(err)
      }
      )
    },
    onSuccess:()=>{
      queryClinet.invalidateQueries(['posts'])
      reset()
    }
  });
  
    function getPosts(){
        return axios.get(`https://route-posts.routemisr.com/posts`,{
            headers:{
              Authorization:`Bearer ${token}`
            }
        })
    }
    function getMyPost(){
        return axios.get(`https://route-posts.routemisr.com/users/69a0c03c056bdb7627489486/posts`,{
            headers:{
              Authorization:`Bearer ${token}`
            }
        })
    }
    function getFeedPosts(){
        return axios.get(`https://route-posts.routemisr.com/posts/feed?only=following`,{
            headers:{
              Authorization:`Bearer ${token}`
            }
        })
    }
    function getBookmarks(){
        return axios.get(`https://route-posts.routemisr.com/users/bookmarks`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
    }
    const {data,isLoading,error}=useQuery({
        queryKey:['posts',type],
        queryFn:queryMap[type] ,
    })
    console.log(data)
  return (
    <div className='max-w-screen-xl mx-auto mt-20 flex items-start gap-2 p-4'>
      <div className="rounded-2xl border-border bg-white p-3 w-1/5 h-[190px] sticky top-20">
        <ul>
          <li>
            <button onClick={()=>{setType('feed')}} className='text-greyText flex gap-3 items-center font-bold hover:bg-[#f8fafc] p-2 rounded-xl w-full focus:text-textPrimary focus:bg-background'>
              <i className='fa-regular fa-newspaper'></i>
              Feed
            </button>
          </li>
          <li>
            <button onClick={()=>{setType('myPosts')}} className='text-greyText flex gap-3 items-center font-bold hover:bg-[#f8fafc] p-2 rounded-xl w-full focus:text-textPrimary focus:bg-background'>
              <i className='fa-regular fa-star'></i>
              My Posts
            </button>
          </li>
          <li>
            <button onClick={()=>{setType('community')}} className='text-greyText flex gap-3 items-center font-bold hover:bg-[#f8fafc] p-2 rounded-xl w-full focus:text-textPrimary focus:bg-background'>
              <i className='fa-solid fa-earth'></i>
              Community
            </button>
          </li>
          <li>
            <button onClick={()=>setType('bookmarks')} className='text-greyText flex gap-3 items-center font-bold hover:bg-[#f8fafc] p-2 rounded-xl w-full focus:text-textPrimary focus:bg-background'>
              <i className='fa-regular fa-bookmark'></i>
              Saved
            </button>
          </li>
        </ul>
      </div>
      
      <div className=' p-4  w-[55%] flex flex-col gap-4'>
      <div className="rounded-xl border-border p-3 bg-white">
        <div className="flex gap-3 items-center">
          <img className='rounded-full size-10' src={user?.photo} alt="" />
          <div className='flex flex-col gap-2'>
              <h3 className='font-extrabold text-sm'>{user?.name} </h3>
              <select className='w-[90px] rounded-2xl text-sm px-1 bg-[#f1f5f9]' name="privacy" id="privacy">
                <option value="Public">Public</option>
                <option value="Followers">Followers</option>
                <option value="Only me">Only me</option>
              </select>
          </div>
          
      </div>
      <div className="my-3">
        <textarea {...register('body')} className='p-3 rounded-xl border-border bg-[#f8fafc] border-1 w-full h-[100px]'id="content" placeholder='Whats on your mind ,Abeer?'></textarea>
      </div>
      {img && <div className="my-3 relative ">
        <button onClick={()=>{setImg(false); setImgPreview('')}} className="rounded-full text-white bg-[#080b11] absolute right-3 top-1">
          <i className='fa-solid fa-x '></i>
        </button>
        <img className='rounded-xl object-center object-cover h-[200px] w-full' src={imgPreview} alt="" />
      </div>}
      <hr />
      <div className="flex justify-between my-3 ">
        <div className="flex gap-6">
          <input
            id="image"
            type="file"
            className="hidden"
            {...register('image', {
              onChange: (e) => {
                const file = e.target.files[0];
                if(file){
                  setImgPreview(URL.createObjectURL(file));
                  setImg(true);
                }
              }
            })}
          />
          <label  htmlFor='image' className='rounded-xl flex gap-2 items-center text-sm font-bold text-greyText px-3 py-1 hover:bg-background'>
            <i className='fa-regular fa-image text-green-700'></i>
            Photo/video
            
          </label>
          <button className='rounded-xl flex gap-2 items-center text-sm font-bold text-greyText px-3 py-1 hover:bg-background'>
            <i className='fa-regular fa-face-smile text-yellow-500'></i>
            Feeling/activity
          </button>
        </div>
        <button onClick={handleSubmit(mutate)} className='flex items-center gap-2 bg-textPrimary text-white py-2 px-3 font-bold rounded-xl'>
          Post
          <i className='fa-regular fa-paper-plane'></i>
        </button>
      </div>
      
      </div>
        {type==='bookmarks'?data?.data?.data?.bookmarks?.map((bookmark)=>
        <PostItem post={bookmark} key={bookmark._id}></PostItem>
        ): data?.data?.data?.posts?.map((post)=>
          <PostItem post={post} key={post._id}></PostItem>
        )}
        
      </div>
      <div className="p-4 border-border border-1 rounded-xl bg-white w-[25%] sticky top-20 flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex gap-3 items-center">
            <i className='fa-solid fa-user-group text-textPrimary'></i>
            <h3 className='font-extrabold'>Suggested Friends </h3>
          </div>
          <div className='bg-gray-100 px-2 rounded-full'>
            <h3>{suggestions?.length}</h3>
          </div>
        </div>
        <div className="my-3 flex flex-col gap-4">
          <input className='rounded-xl px-3 py-1 w-full bg-whiter border-1 border-border bg-[#f8fafc]' type="search"placeholder='Search friends...' />
          {suggestions?.map((suggestion)=>{
            return <SuggestedFriend suggestion={suggestion} key={suggestion._id} ></SuggestedFriend>
          })}
          <button onClick={()=>navigate('/suggestions')} className="rounded-xl bg-backgroundDefault p-2 w-full text-greyText font-bold border-1 border-border">View more</button>
        </div>

      </div>
      
    </div>
  )
}
