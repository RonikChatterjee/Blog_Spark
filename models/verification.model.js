import mongoose from 'mongoose'

const verificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  otp: {
    type: String,
  },
  url: {
    type: String,
    required: true,
  },
  socketId: {
    type: String,
  },
  event: {
    type: String,
    required: true,
  },
  // Field for expiration
  expiresAt: {
    type: Date,
    required: true,
  },
})

// Create a TTL index on expiresAt to auto-delete expired documents
verificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const verificationModel = mongoose.model(
  'verification',
  verificationSchema
)

export default verificationModel
