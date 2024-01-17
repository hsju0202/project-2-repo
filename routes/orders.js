const express = require('express');
const router = express.Router();

const {
    order,
    findOrders,
    findOrderById
} = require('../controller/OrderController');

router.post('/', order);
router.get('/', findOrders);
router.get('/:id', findOrderById);

module.exports = router;