const express = require('express')
const companion = require('@uppy/companion')
const bodyParser = require('body-parser')
const session = require('express-session')

const app = express()

const path = require('path')
const PORT = process.env.PORT || 5001

const fs = require('fs')
const rimraf = require('rimraf')

const DATA_DIR = path.join(__dirname, 'tmp')

app.use(bodyParser.json())
app.use(session({
  secret: 'EPSA-2020',
  resave: true,
  saveUninitialized: true
}))

app.use((req, res, next) => {
res.setHeader('Access-Control-Allow-Origin', '*'); 
//res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*')
//res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
res.setHeader('Access-Control-Allow-Methods', '*');  
res.setHeader('Access-Control-Allow-Headers','Authorization, Origin, Content-Type, Accept');
res.header('Access-Control-Allow-Credentials', 'true');
res.header('Access-Control-Expose-Headers', '*');
next(); 
});

// Routes
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/plain'); 
  res.send('Hola :)');
})

// initialize uppy
const uppyOptions = {
  providerOptions: {
    google: {
      key: '567517067874-k5209vu4abqe128kncga29kat1235epd.apps.googleusercontent.com',
      secret: 'Y8lF1ygjg8kdrZXFMISQqsFH'
    }
  },
  server: {
    host: 'epsa-uppy.herokuapp.com',
    protocol: 'https'
  },
  filePath: DATA_DIR,
  secret: 'EPSA-2020',
  debug: true
}

// Create the data directory here for the sake of the example.
try {
  fs.accessSync(DATA_DIR)
} catch (err) {
  fs.mkdirSync(DATA_DIR)
}
process.on('exit', function () {
  rimraf.sync(DATA_DIR)
})

app.use(companion.app(uppyOptions))

// handle 404
app.use((req, res, next) => {
  return res.status(404).json({ message: 'Not Found' })
})

// handle server errors
app.use((err, req, res, next) => {
  console.error('\x1b[31m', err.stack, '\x1b[0m')
  res.status(err.status || 500).json({ message: err.message, error: err })
})

companion.socket(app.listen(PORT), uppyOptions)

console.log('Welcome to Companion!')
console.log(`Listening on https://0.0.0.0:${PORT}`)