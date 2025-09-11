import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const uri = process.env.MONGO_URI

async function connectDB() {
  await mongoose.connect(uri)
}

export default connectDB
