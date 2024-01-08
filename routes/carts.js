const express = require('express');
const router = express.Router();

const {
    addItem2Cart,
    deleteItemFromCart,
    findCartItems
} = require('../controller/CartController');

router.get('/', findCartItems);
router.post('/', addItem2Cart);
router.delete('/:id', deleteItemFromCart);

module.exports = router;