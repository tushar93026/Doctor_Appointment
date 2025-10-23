import React from 'react'
import {assets} from '../assets/assets_admin/assets.js'
import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext.jsx'
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext.jsx'

const Navbar = () => {

    const {aToken, setAToken} = useContext(AdminContext)
    const {dToken, setDToken} = useContext(DoctorContext)

    const navigate = useNavigate()

    const logout = () => {
 
        navigate('/')
        aToken && setAToken('')
        aToken && localStorage.removeItem('aToken')
        dToken && setDToken('')
        dToken && localStorage.removeItem('dToken')
    }

  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 bg-white'>
      <div className='flex items-center gap-2 text-xs'>
        <img onClick={()=> navigate('/')} className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo} alt='' />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'> {aToken ? 'Admin' : 'Doctor'} </p>
      </div>
      <button onClick={logout} className='bg-[#5f6FFF] text-white text-sm px-10 py-2 rounded-full cursor-pointer hover:bg-[#3C4AFF]'>Logout</button>
    </div>
  )
}

export default Navbar
