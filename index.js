import http from 'http'
import express from 'express'
import { Server } from 'socket.io'
import path from 'path'
import dotenv from 'dotenv'
dotenv.config()

/*
*********************** Socket Configuration ***********************
******* Integreting Socket.io with Express using HTTP Server *******
The Library Socket.io upgrades the normal http Connection into a WebSocket Connection. It is a full-duplex connection which remains open until closed by either the client or the server.
*/

// Creating Express App
const app = express()
// Creating HTTP Server with Express App
const httpServer = http.createServer(app)
// Creating Socket.io server with HTTP Server
const io = new Server(httpServer)

const PORT = process.env.PORT || 8000

// DB Connection
import connectDB from './database/index.js'
connectDB()
  .then(() => console.log('✔ Database Connected Successfully'))
  .catch(err =>
    console.error(`❌ Database Connection Failed: ${err}`)
  )

// Setting Template Engine
app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))

// Use EJS Layouts
import expressEjsLayouts from 'express-ejs-layouts'
app.use(expressEjsLayouts)
app.set('layout', 'layouts/base_format')
app.set('layout extractStyles', true)
app.set('layout extractScripts', true)

// Middleware
import cookieParser from 'cookie-parser'
app.use(cookieParser())
app.use(express.static(path.resolve('./public')))
app.use(express.json())

// initialising passport middleware for authentication
import passport from 'passport'
import './config/passport.js'
app.use(passport.initialize())

// Handle favicon requests
app.get('/favicon.ico', (req, res) => res.status(204).end())

// Routes
import homeRouter from './routes/home.routes.js'
import userRouter from './routes/user.routes.js'
import testRouter from './routes/test.routes.js'
import verifyRouter from './routes/verify.routes.js'
import oauthRouter from './routes/oauth.routes.js'

// Apply authOptional middleware only to specific routes that need it
app.use('/', homeRouter)
app.use('/user', userRouter)
app.use('/verify', verifyRouter)
app.use('/oauth', oauthRouter)
app.use('/test', testRouter)

httpServer.listen(PORT, () => {
  console.log('='.repeat(50))
  console.log('🚀 LOGIN FORM SERVER STARTED')
  console.log('='.repeat(50))
  console.log(`📡 Port: ${PORT}`)
  console.log(`🌐 URL: ${process.env.BASE_URL}`)
  console.log('='.repeat(50))
})

export { io }
