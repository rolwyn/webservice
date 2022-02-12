const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const routes = require('./routes/index')
const cors = require('cors')
const db = require('../config/database')

// creates an express server
const app = express();

// Test db
db.authenticate()
    .then(() => console.log('Database Connected...'))
    .catch(err => console.log('Error:' +err))

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

// set routes
routes(app);

module.exports = app;