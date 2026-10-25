import React from 'react'
import { Outlet } from 'react-router-dom'
import {ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Navigation from './pages/Auth/Navigation'

const App = () => {
  return (
    <>
    <main className='py-3'>
      <Navigation />
      <Outlet />
    </main>
    </>
  )
}

export default App
