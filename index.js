import express from 'express'
const app = express()
const PORT = process.env.PORT || 8000

// DB Connection
import connectDB from './database/index.js'
connectDB()
  .then(() => console.log('✔ Database Connected Successfully'))
  .catch(err =>
    console.error(`❌ Database Connection Failed: ${err}`)
  )

// Setting Template Engine
import path from 'path'
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
app.use(express.static('public'))
app.use(express.json())

// Handle favicon requests
app.get('/favicon.ico', (req, res) => res.status(204).end())

// Routes
import homeRouter from './routes/homeRoutes.js'
import userRouter from './routes/userRoutes.js'
import testRouter from './routes/testRoutes.js'

// Apply authOptional middleware only to specific routes that need it
app.use('/', homeRouter)
app.use('/user', userRouter)
app.use('/test', testRouter)

app.listen(PORT, () => {
  console.log('='.repeat(50))
  console.log('🚀 LOGIN FORM SERVER STARTED')
  console.log('='.repeat(50))
  console.log(`📡 Port: ${PORT}`)
  console.log(`🌐 URL: http://localhost:${PORT}`)
  console.log('='.repeat(50))
})
