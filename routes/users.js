const express = require('express');
const router = express.Router();

const {
    join,
    login,
    requestResetPassword,
    resetPassword
} = require('../controller/UserController');

router.post('/join', join);
router.post('/login', login);
router.post('/reset', requestResetPassword);
router.put('/reset', resetPassword);

module.exports = router;