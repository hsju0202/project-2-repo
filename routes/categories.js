const express = require('express');
const router = express.Router();

const {
    findCategories,
} = require('../controller/CategoryController');

router.get('/', findCategories);

module.exports = router;