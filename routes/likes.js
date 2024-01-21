const express = require('express');
const router = express.Router();

const checkAuthAndSetUser = require('../middleware/authorization');

const {
    createLike,
    deleteLike
} = require('../controller/LikeController');

router.post('/', checkAuthAndSetUser, createLike);
router.delete('/', checkAuthAndSetUser, deleteLike);

module.exports = router;