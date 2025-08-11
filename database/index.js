import mongoose from 'mongoose'

const uri =
  'mongodb+srv://optimus_local:Ronik%408728%2469@cluster0.9ye7iaj.mongodb.net/BlogSpark?retryWrites=true&w=majority&appName=Cluster0'

async function connectDB() {
  await mongoose.connect(uri)
}

export default connectDB
