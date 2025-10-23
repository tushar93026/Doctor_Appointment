import mongoose from 'mongoose'

const connectDB = async() => {

    mongoose.connection.on('connected', ()=> console.log('MongoDB Database Connected !'))

    await mongoose.connect(`${process.env.MONGODB_URI}/doctors4appoint`)
}

export default connectDB