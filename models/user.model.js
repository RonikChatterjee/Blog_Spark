import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    profileImg: {
      type: String,
    },
    coverImg: {
      type: String,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    gender: {
      type: String,
      required: true,
    },
    contact: {
      type: Number,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

const userModel = new mongoose.model('user', userSchema)

export default userModel
