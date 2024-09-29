// Import necessary modules
const express = require('express');
const app = express();
const path = require('path');
require("dotenv").config();
const bodyParser = require('body-parser');
const db = require('./src/db/config');

const session = require('express-session');

app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key', // Use a strong secret in a real project
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set `secure: true` if you're using HTTPS
}));

app.use(bodyParser.json());

// Middleware setup
app.use(express.static('views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use('/fontAwesome', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free')));
app.use(express.urlencoded({ extended: true }));


// Import and use the router
const router = require('./src/controller/auth');
app.use('/', router);

// Define the server port
const PORT = process.env.PORT || 4141;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
