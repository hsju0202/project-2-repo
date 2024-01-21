const express = require('express');
const router = express.Router();

const checkAuthAndSetUser = require('../middleware/authorization');

const {
    addItem2Cart,
    deleteItemFromCart,
    findCartItems
} = require('../controller/CartController');

router.get('/', checkAuthAndSetUser, findCartItems);
router.post('/', checkAuthAndSetUser, addItem2Cart);
router.delete('/:id', checkAuthAndSetUser, deleteItemFromCart);

module.exports = router;