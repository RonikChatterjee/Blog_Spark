import mongoose from 'mongoose'

const likeSchema = new mongoose.Schema({
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blog',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
},
{timestamps: true})

const likeModel = new mongoose.model('like', likeSchema)

export default likeModel
