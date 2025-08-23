const express = require('express')
const router = express.Router()

const { addUser, getUser } = require('../controllers/userController')

// http://localhost:5000/api/user/register
router.post('/register', addUser);

// http://localhost:5000/api/user/login
router.post('/login', getUser);

module.exports = router