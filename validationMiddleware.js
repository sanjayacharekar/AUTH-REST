const { body } = require('express-validator');

exports.validateUserRegistration = [
  body('name').trim().escape().notEmpty().withMessage('Name is required'),
  body('username').trim().escape().notEmpty().withMessage('Username is required'),
  body('password').escape().notEmpty().withMessage('Password is required')
];

exports.validateUserLogin = [
  body('username').trim().escape().notEmpty().withMessage('Username is required'),
  body('password').escape().notEmpty().withMessage('Password is required')
];
