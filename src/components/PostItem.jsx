import axios from 'axios'
import React, { useContext, useRef, useState } from 'react'
import { AuthContext } from '../context/authContext'
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from "date-fns";
import Comment from './Comment';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
export default function PostItem({post}) {
    const [bookmark,setIsbookmark]=useState(post?.bookmarked);
    const [allComment,viewComments]=useState(false);
    const [editpost,isEdit]=useState(false);
    const [menu,setMenu]=useState(false);
    const [theTopComment,viewTopComment]=useState(true);
    const [img,setImg]=useState(false);
    const [imgPreview,setImgPreview]=useState('');
    const queryClient=useQueryClient();
    const [like,setLike]=useState(post?.likesCount);
    const navigate=useNavigate();
    const token=localStorage.getItem('token')
    const contentRef=useRef()
    const {user}=useContext(AuthContext)
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
    const {mutate:savePost,isPending:pendingSavePost,data:savePostData}=useMutation({
        mutationKey:['post'],
        mutationFn:async ()=>{
            const res= await axios.put(`https://route-posts.routemisr.com/posts/${post?._id}/bookmark`,{},{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            return res?.data;
        },
        onSuccess:(data)=>{
            setIsbookmark(data?.data?.bookmarked)
            queryClient.invalidateQueries(['posts'])
        }
    })
    const {mutate:deletePost,isPending:pendingDeletePost}=useMutation({
        mutationKey:['post'],
        mutationFn:()=>{
            return axios.delete(`https://route-posts.routemisr.com/posts/${post?._id}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
        },
        onSuccess:()=>{
            queryClient.invalidateQueries(['posts'])
            isEdit(false)
        }
    });
    const handleSave = () => {
        return contentRef.current.value; // get current value of textarea
    }

    const {mutate:editPost,isPending:pendingEditPost}=useMutation({
        mutationKey:['post'],
        mutationFn:(data)=>{
            const formdata=new FormData();
            formdata.append('body',data.content);
            return axios.put(`https://route-posts.routemisr.com/posts/${post?._id}`,formdata,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
        },
        onSuccess:()=>{
            queryClient.invalidateQueries(['posts'])
            queryClient.invalidateQueries(['post'])
            setPostBody(data.data.body); 
            isEdit(false)
        }
    });
    const [postBody, setPostBody] = useState(post?.body);
    const {register,handleSubmit,reset,setValue}=useForm({
        defaultValues:{
            content:'',
        }
    });
    const {mutate:comment,isPending:addCommentPending,}=useMutation({
        mutationKey:['comments',post._id],
        enabled: !!post?._id,
        mutationFn:async (data)=>{
            const formData=new FormData();
            formData.append('content',data.content)

                if (data.image && data.image[0]) {
                    formData.append('image', data.image[0]);
                }
                     return await axios.post(`https://route-posts.routemisr.com/posts/${post?._id}/comments`,formData,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
        },
        onSuccess:()=>{
            queryClient.invalidateQueries(['comments', post?._id])
            queryClient.invalidateQueries(['posts'])
            reset()
            setImg(false)
            setImgPreview('')

        },
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
  return (
    
    <div className='bg-white rounded-2xl border-1 border-[#dadcdf]'>
      <div className="flex justify-between p-3">
        <div className="flex gap-3 items-center">
            <img className='rounded-full size-10' src={post?.user?.photo} alt="" />
            <div>
                <button onClick={()=>navigate(`/posts/${post?._id}`)} className='font-extrabold text-sm'>{post?.user?.name}</button>
                <p className='text-xs text-gray-500'>
                    <span className='text-black me-3'>@{post?.user?.username}</span>
                    {formatDistanceToNow(new Date(post?.createdAt), {
                        addSuffix: true
                    })} 
                    <span className='ms-3 text-black'>{post?.privacy}</span>
 
                    </p>
            </div>
        </div>
        <div className='relative'>
            <button onClick={()=>{setMenu(prev=>!prev)}}>
                <i className="fa-solid fa-ellipsis"></i>
            </button>
            {menu && <div className='w-50 bg-white rounded-xl flex flex-col border-border border-1 p-1 gap-1 my-3 absolute end-2'>
            <button onClick={()=>{savePost(); setMenu(false)}} className='flex gap-3 items-center p-2 rounded-xl hover:bg-background font-semibold text-greyText'>
                <i className='fa-regular fa-bookmark'></i>
                {bookmark?'UnSave Post':'Save Post'}
            </button>
            {user?.id === post?.user?._id && <div>
            <button onClick={()=>{isEdit(true); setMenu(false);    setValue("content", post?.body)}} className='flex gap-3 items-center p-2 rounded-xl hover:bg-background font-semibold text-greyText'>
                <i className='fa-solid fa-pen'></i>
                Edit Post
            </button>
            <button onClick={()=>{deletePost(); setMenu(false)}}  className='flex gap-3 items-center text-danger p-2 rounded-xl hover:bg-danger-50 font-semibold '>
                <i className='fa-solid fa-trash'></i>
                Delete Post
            </button>
            </div>}
            </div>}
        </div>
        </div>
        {!editpost && <p  className='px-3 pb-3 text-sm'>{post?.body}</p>}
        {editpost && <div>
            <textarea ref={contentRef}  defaultValue={post?.body} className='my-2 rounded-xl border-1 mx-2 w-[98%] border-border p-2'  name="editPost" id="edit"></textarea>
            <div className="flex justify-end gap-2 p-2 w-full my-2">
                <button onClick={()=>{isEdit(false)}} className='rounded-xl border-1 border-border p-2 font-bold text-sm'>Cancel</button>
                <button onClick={
                    
                    ()=>{
                        isEdit(false)
                        const currentContent = contentRef.current.value;
                        editPost({content:currentContent})}
                    
                    } className='rounded-xl bg-textPrimary text-white p-2 font-bold text-sm'>Save</button>
            </div>
        </div>}
        <img className='w-full' src={post?.image} alt="" />
        <div className="flex justify-between p-3">
            <div className="like flex gap-2 items-center">
                <div className='bg-[#1877f2] p-1 rounded-full text-center text-sm text-white'>
                    <i className="fa-regular fa-thumbs-up text-white "></i>
                </div>
                <p className='font-semibold text-sm text-[#62748e]'>{post?.likesCount} Likes</p>
            </div>
            <div className='flex gap-2 '>
                <p className='font-semibold text-sm text-[#62748e] p-3'>{post?.sharesCount} shares</p>
                <p className='font-semibold text-sm text-[#62748e] p-3'>{post?.commentsCount} comments</p>
                <button onClick={()=>navigate(`/posts/${post?._id}`)} className='font-bold text-textPrimary p-2 hover:bg-background rounded-xl'>View details</button>
            </div>
            
        </div>
        <hr className='text-gray-400'/>
        <div className="flex  ">
            <div className="flex p-3 w-1/3">
                <button onClick={()=>mutate()} className='w-full justify-center flex gap-2 items-center font-bold p-2 hover:bg-background rounded-xl text-[#45556c]'>
                    <i className='fa-regular fa-thumbs-up'></i>
                    Like
                </button>
            </div>
            <div className="flex p-3 w-1/3">
                <button onClick={()=>{
                    viewComments(prev=>!prev)
                    viewTopComment(prev=>!prev)

                }} className='w-full justify-center flex gap-2 items-center font-bold p-2 hover:bg-background rounded-xl text-[#45556c]'>
                    <i className='fa-regular fa-comment'></i>
                    Comment
                </button>
            </div>
            <div className="flex p-3 w-1/3">
                <button className='w-full justify-center flex gap-2 items-center font-bold p-2 hover:bg-background rounded-xl text-[#45556c]'>
                    <i className='fa-solid fa-share-nodes'></i>
                    Share
                </button>
            </div>
        </div>
       {post?.topComment && theTopComment &&  <div className="p-3">
            <div className="rounded-2xl border-1 border-border p-3 bg-[#f8fafc]">
                <p className='text-greyText font-bold'>Top Comment</p>
                <div className="flex gap-3 items-center mt-3">
                    <img className='rounded-full size-10' src={post?.topComment?.commentCreator?.photo} alt="" />
                    <div className='bg-white rounded-xl w-full p-2'>
                        <h3 className='font-extrabold text-sm'>{post?.topComment?.commentCreator?.name}</h3>
                        <p className='text-sm text-greyText'>{post?.topComment?.content}</p>
                    </div>
                </div>

                <button onClick={()=>{
                    viewComments(true)
                    viewTopComment(false)

                }} className='text-sm text-textPrimary font-bold hover:underline'>View all Comments</button>
            </div>
        </div>
        }
        {allComment &&<div className='flex flex-col gap-3 my-3 p-3 bg-[#f8fafc]'>
            <div className="flex justify-between items-center rounded-xl bg-white border-border border-1 p-1">
                <div className="flex gap-2 items-center p-3 ">
                    <h2>Comments</h2>
                    <div className='bg-background text-textPrimary text-xs rounded-full size-5 flex justify-center items-center' >{comments?.length}</div>
                </div>
                <select className='rounded-xl border-1 bg-backgroundDefault border-border p-1 font-bold text-sm' name="comments" id="comment">
                    <option value="Most relevant">Most relevant</option> 
                    <option value="Newest">Newest</option> 
                </select>
            </div>
            {comments?.map((comment)=><Comment comment={comment} key={comment?._id}/>)}
            <div className="flex gap-3 p-3 items-start my-1">
            <img src={user?.photo} alt="" className="rounded-full size-10" />
            <div className="w-full flex flex-col gap-2">
            <textarea
                {...register('content')}
                className="resize-none rounded-xl border-1 border-border bg-[#f0f2f5] p-2 w-full min-h-[100px] "
                placeholder={`Comment as ${user?.name}...`}
            ></textarea>

            <div className="flex justify-between items-center px-2">
                <div className="flex gap-4">
                <input
                id="img"
                type="file"
                hidden
                {...register('image')}
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    setImgPreview(URL.createObjectURL(file));
                    setImg(true);
                }}
                />
                <label htmlFor='img' >
                    <i className="fa-regular fa-image text-gray-500 hover:text-green-600"></i>
                </label>
                <button>
                    <i className="fa-regular fa-smile text-gray-500 hover:text-yellow-600"></i>
                </button>
                </div>

                <button
                onClick={handleSubmit(comment)}
                className="bg-[#9ec5ff] rounded-full size-8 flex items-center justify-center"
                >
                <i className="fa-solid fa-paper-plane text-white"></i>
                </button>
            </div>
        </div>
        </div>
        {img  && <div className="my-1 relative">
            <button onClick={()=>{
                setImg(false)
                setImgPreview()
            }} className="bg-[#262e38] size-5 rounded-full flex justify-center items-center top-2 right-2 absolute">
                <i className='fa-solid fa-x text-white  fa-xs'></i>
            </button>
            <img src={imgPreview} className='rounded-xl w-full object-center h-[200px]  object-cover p-1' alt="" />
        </div>}
        </div>}
        
    </div>
  )
}
