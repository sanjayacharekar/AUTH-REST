require('dotenv').config();

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const db = require('./db');
const { validateUserRegistration, validateUserLogin } = require('./validationMiddleware');
const { authenticateUser, createUser, getUserDetails } = require('./userController');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'testthesecret',
  resave: false,
  saveUninitialized: true
}));

app.post('/auth', validateUserLogin, authenticateUser);
app.post('/create-user', validateUserRegistration, createUser);
app.get('/get-details', getUserDetails);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
