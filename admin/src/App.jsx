import React from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import { useContext } from 'react';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import {Route, Routes} from 'react-router-dom'
import Dashboard from './pages/AdminPages/Dashboard';
import AllApointments from './pages/AdminPages/AllApointments';
import AddDoctor from './pages/AdminPages/AddDoctor';
import DoctorsList from './pages/AdminPages/DoctorsList';
import { DoctorContext } from './context/DoctorContext';
import DoctorDashboard from './pages/DoctorPages/DoctorDashboard';
import DoctorAppointments from './pages/DoctorPages/DoctorAppointments';
import DoctorProfile from './pages/DoctorPages/DoctorProfile';


const App = () => {

  const {aToken} = useContext(AdminContext)

  const {dToken} = useContext(DoctorContext)

  return  aToken || dToken ?  (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          {/**-------- Admin Routes ------------ */}
          <Route path='/' element={<Dashboard/>} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllApointments />} />
          <Route path='/add-doctor' element={<AddDoctor /> } />
          <Route path='/doctor-list' element={<DoctorsList />} />

          {/**-------- Doctor Routes ----------- */}
          <Route path='/doctor-dashboard' element = {<DoctorDashboard />} />
          <Route path='/doctor-appointments' element = {<DoctorAppointments />} />
          <Route path='/doctor-profile' element = {<DoctorProfile />} />
          
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  )
}

export default App

