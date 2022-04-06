const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const routes = require('./routes/index')
const cors = require('cors')
const db = require('../config/database')
// require('dotenv').config()
const morgan = require('morgan');

// creates an express server
const app = express();

app.use(morgan('tiny'));

db.sync({ force: false }).then(() => {
    console.log("Drop and re-sync db.");
});

// Test db
db.authenticate()
    .then(() => console.log('Database Connected...'))
    .catch(err => console.log('Error:' +err))

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

// set routes
routes(app);

module.exports = app;