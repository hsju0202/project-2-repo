const express = require('express');
const router = express.Router();

const {
    findBooks,
    findBookById
} = require('../controller/BookController');

router.get('/', findBooks);
router.get('/:id', findBookById);

module.exports = router;