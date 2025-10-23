import express from 'express'
import { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentRazorpay, verifyRazorpay } from '../Controllers/user.controller.js'
import authUser from '../Middlewares/authUser.middleware.js'
import upload from '../Middlewares/multer.middleware.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)

userRouter.post('/login', loginUser)

userRouter.get('/get-profile',authUser ,getProfile)

userRouter.post('/update-profile', upload.single('image'),authUser ,updateProfile)

userRouter.post('/book-appointment', authUser, bookAppointment)

userRouter.get('/appointments',authUser ,listAppointment)

userRouter.post('/cancel-appointment', authUser, cancelAppointment)

userRouter.post('/payment-razorpay', authUser, paymentRazorpay)

userRouter.post('/verifyRazorpay', authUser, verifyRazorpay)



export default userRouter