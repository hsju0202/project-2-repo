const express = require('express');
const router = express.Router();

//주문 하기
router.post('/', (req, res) => {
    res.json('hello');
});

//주문 목록 조회
router.get('/', (req, res) => {
    res.json('hello');
});

router.get('/:id', (req,res) => {
    res.json('hello');
});

module.exports = router;