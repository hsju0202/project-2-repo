const express = require('express');
const router = express.Router();

const {
    createLike,
    deleteLike
} = require('../controller/LikeController');

router.post('/', createLike);
router.delete('/:bookId', deleteLike);

module.exports = router;