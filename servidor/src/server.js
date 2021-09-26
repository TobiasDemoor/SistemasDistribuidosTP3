const express = require('express');
const morgan = require('morgan');
const moment = require('moment');
const { getRoutes } = require('./routes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express()

// log de requests
if (process.env.NODE_ENV === 'production') {
    morgan.token('date', () => moment().format('YYYY-MM-DD HH:mm'));
    app.use(morgan('[:date] ":method :url HTTP/:http-version" :status '))
} else {
    app.use(morgan('dev'))
}

// middleware
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

// routes
app.use('', getRoutes())

app.use(errorMiddleware);

module.exports = app;
