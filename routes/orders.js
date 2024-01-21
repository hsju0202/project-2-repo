const express = require('express');
const router = express.Router();

const checkAuthAndSetUser = require('../middleware/authorization');

const {
    order,
    findOrders,
    findOrderById
} = require('../controller/OrderController');

router.post('/', checkAuthAndSetUser, order);
router.get('/', checkAuthAndSetUser, findOrders);
router.get('/:id', checkAuthAndSetUser, findOrderById);

module.exports = router;