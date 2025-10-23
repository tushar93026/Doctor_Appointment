import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../Models/user.model.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../Models/doctor.model.js'
import appointmentModel from '../Models/appointment.model.js'
import razorpay from 'razorpay'


// API to register user

const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body

        if (!name || !password || !email) {
            return res.json({
                success: false,
                message: "Missing Details"
            })
        }

        // validating email
        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Enter a valid enmail"
            })
        }
        // validating strong password
        if (password.length < 8) {
            return res.json({
                success: false,
                message: "Enter a strong password"
            })
        }

        // Hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({
            success: true,
            token
        })



    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}


// API for user login

const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({
                success: false,
                message: "User does not exist"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({
                success: true,
                token
            })
        } else {
            res.json({
                success: false,
                message: "Invalid Credentials"
            })
        }



    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }

}


// API to get user profile data

const getProfile = async (req, res) => {

    try {

        const userId = req.userId
        const userData = await userModel.findById(userId).select('-password')

        res.json({
            success: true,
            userData
        })


    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }

}

// API to update user profile

const updateProfile = async (req, res) => {

    try {

        const { name, phone, address, dob, gender } = req.body
        const userId = req.userId
        const imageFile = req.file

        if (!name || !phone || !gender || !dob) {
            return res.json({
                success: false,
                message: "Data Missing"
            })
        }

        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })

        if (imageFile) {
            // upload image to cludinary

            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageURL })
        }

        res.json({
            success: true,
            message: "Profile Updated"
        })

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }

}


// API to book appointment

const bookAppointment = async (req, res) => {

    try {

        const userId = req.userId
        const { docId, slotDate, slotTime } = req.body

        const docData = await doctorModel.findById(docId).select('-password')

        if (!docData.available) {
            return res.json({
                success: false,
                message: "Doctor Not Available"
            })
        }

        let slots_booked = docData.slots_booked

        // checking for slots availability
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({
                    success: false,
                    message: "Slot Not Available"
                })
            } else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {

            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)

        }

        const userData = await userModel.findById(userId).select('-password')

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // save new slots data in doctors data
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({
            success: true,
            message: "Appointment Booked"
        })


    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }

}

// API to get user appointments for frontend my appointment page

const listAppointment = async (req, res) => {

    try {

        const userId = req.userId
        const appointments = await appointmentModel.find({ userId })

        res.json({
            success: true,
            appointments
        })

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }

}

// API to cancel appointment

const cancelAppointment = async (req, res) => {

    try {

        const userId = req.userId
        const { appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify appointment user
        if (appointmentData.userId !== userId) {
            return res.json({
                success: false,
                message: "Unauthorized Action"
            })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // releasing doctors slot
        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({
            success: true,
            message: "Appointment Cancelled"
        })


    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }

}

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})


// API to make Payment using Razorpay

const paymentRazorpay = async (req, res) => {

    try {

        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({
                success: false,
                message: "Appointment cancelled or not found"
            })
        }

        // creating options for razorpay payment

        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId
        }

        // creation of an order
        const order = await razorpayInstance.orders.create(options)

        res.json({
            success: true,
            order
        })

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }

}


// API to verify rzp payment

const verifyRazorpay = async(req,res) => {

    try {

        const {razorpay_order_id} = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id) 

        if(orderInfo.status === 'paid'){
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {payment: true})
            res.json({
                success: true,
                message: "Payment Successful"
            })
        } else {
            res.json({
                success: false,
                message: "Payment Failed"
            })
        }
        
    } catch (error) {
        
    }

}





export {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    paymentRazorpay,
    verifyRazorpay
}

