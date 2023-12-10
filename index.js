const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const path = require('path')

const connectDB = require('./server/database/connection')

const app = express()

dotenv.config({ path: 'config.env' })
const PORT = process.env.PORT || 8080

// session
app.use(
  session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 7200000 },
  }),
)
app.use(flash())

// log requests
app.use(morgan('tiny'))

// mongodb connection
connectDB()

// parse request to body-parser
app.use(bodyParser.urlencoded({ extended: true }))

// set view engine
app.set('view engine', 'ejs')

// load assets
app.use('/dist', express.static(path.resolve(__dirname, 'assets/dist')))
app.use('/plugins', express.static(path.resolve(__dirname, 'assets/plugins')))

// load routers
app.use('/', require('./server/routes/router'))

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
