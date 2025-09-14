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
    },
    contact: {
      type: Number,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      unique: true,
    },
    githubId: {
      type: String,
      unique: true,
    },
    facebookId: {
      type: String,
      unique: true,
    },
    oauthProvider: {
      type: [String],
      enum: ['local', 'google', 'github', 'facebook'],
      default: ['local'],
    },
    hasPassword: {
      type: Boolean,
      default: function () {
        return this.oauthProvider.includes('local')
      },
    },
  },
  { timestamps: true }
)

const userModel = new mongoose.model('user', userSchema)

export default userModel
