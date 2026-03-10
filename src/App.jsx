import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { HeroUIProvider } from '@heroui/react'
import LandingPage from './pages/LandingPage'
import Layout from './components/Layout'
import Notification from './pages/notifications'
import Profile from './pages/profile'
import Feed from './pages/feed'
import AuthContextProvider, { AuthContext } from './context/authContext'
import ProtectedRoute from './pages/ProtectedRoute'
import Suggestions from './pages/Suggestions'
import PostPage from './pages/postPage'

function App() {
  const routes=createBrowserRouter([
    {path:'/auth',element:<LandingPage/>},
    {path:'/',element:<ProtectedRoute><Layout></Layout></ProtectedRoute>,children:[
    {index:true,path:'/feed',element:<Feed></Feed>},
    {path:'/profile',element: <Profile/>},
    {path:'/profile/:id',element:<Profile/>},
    {path:'/notifications',element:<Notification></Notification>},
    {path:'/suggestions',element:<Suggestions></Suggestions>},
    {path:'/posts/:postId',element:<PostPage/>}
    ]},

  ])
  return (
    <HeroUIProvider>
      <AuthContextProvider>
        <RouterProvider router={routes}> </RouterProvider>
      </AuthContextProvider>
    </HeroUIProvider>
  )
}

export default App
