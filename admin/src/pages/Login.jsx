import React from 'react'
import {assets} from '../assets/assets_admin/assets.js'
import { useState, useContext } from 'react'
import { AdminContext } from '../context/AdminContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../context/DoctorContext.jsx'
import {useNavigate} from 'react-router-dom'


const Login = () => {

  const [state, setState] = useState('Admin')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const {setAToken, backendUrl} = useContext(AdminContext)
  
  const {setDToken} = useContext(DoctorContext)

  const navigate = useNavigate()

  const onSubmitHandler = async(e) => {

    e.preventDefault()

    try {

       if(state === 'Admin'){

        const {data} = await axios.post(backendUrl + '/api/admin/login', {email, password})

        if(data.success){
          localStorage.setItem('aToken', data.token)
           setAToken(data.token )
           navigate('/admin-dashboard')

        } else {
          toast.error(data.message)
        }

       } else {

        const {data} = await axios.post(backendUrl + '/api/doctor/login', {email,password})
        if(data.success){
          localStorage.setItem('dToken', data.token)
           setDToken(data.token)
           navigate('/doctor-dashboard')
        } else {
          toast.error(data.message)
        }

       }
      
    } catch (error) {
      
    }
  }

  return (

    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'> <span className='text-[#5f6FFF]'> {state} </span> Login </p>
        <div className='w-full '>
           <p>Email</p>
           <input onChange={(e)=> setEmail(e.target.value)} value={email} type='email' required className='border border-[#DADADA] rounded w-full p-2 mt-1' /> 
        </div>
        <div className='w-full'>
           <p>Password</p>
           <input onChange={(e)=> setPassword(e.target.value)} value={password} type='password' required className='border border-[#DADADA] rounded w-full p-2 mt-1' /> 
        </div>

        <button className='bg-[#5f6FFF] text-white w-full py-2 rounded-md text-base cursor-pointer'>Login</button>

        {
          state === "Admin" 
          ? <p>Doctor Login? <span className='text-[#5f6FFF] underline cursor-pointer' onClick={()=>setState('Doctor')}>Click here</span> </p> 
          : <p>Admin Login? <span className='text-[#5f6FFF] underline cursor-pointer' onClick={()=>setState('Admin')}>Click here</span> </p>
        }

      </div>
    </form>
  )
}

export default Login
