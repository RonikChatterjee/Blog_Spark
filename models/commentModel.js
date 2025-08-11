import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blog',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment'
    },
    content: {
        type: String,
        required: true
    }
},
{timestamps: true})

const commentModel = new mongoose.model('comment', commentSchema)

export default commentModel
