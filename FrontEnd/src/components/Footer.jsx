import React from 'react'
import {assets} from '../assets/assets_frontend/assets.js'
import { NavLink } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm '>
        {/**-------------- Left Section ------------- */}
        <div>
            <img className='mb-5 w-40' src={assets.logo} alt='' />
            <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        </div>

        {/**-------------- Center Section ----------- */}
        <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-2 text-gray-600'>
                <NavLink onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} to={'/'}>Home</NavLink>
                <NavLink onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} to={'/about'}>About us</NavLink>
                <NavLink onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} to={'/contact'}>Contact us</NavLink>
                <li>Privacy policy</li>
            </ul>
        </div>

        {/**-------------- Right Section ------------ */}
        <div>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-2 text-gray-600'>
                <li>+1-212-456-7890</li>
                <li>doctors4appoint@gmail.com</li>
            </ul>
        </div>

      </div>

      {/**-------------------- Copyright Text --------------- */}
      <div>
        <hr />
        <p className='py-5 text-sm text-center'>Copyright 2025@ Prescripto - All Rights Reserved.</p>
      </div>
    </div>
  )
}

export default Footer
