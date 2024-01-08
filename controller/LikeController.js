const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
// const jwt = require('jsonwebtoken');
// const crypto = require('crypto');

const createLike = (req, res) => {
    const {user_id, book_id} = req.body;

    const sql = 'insert into likes (user_id, book_id) values (?, ?)';
    const values = [user_id, book_id];

    conn.query(sql, values,
        (err, results) => {
            if (err) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message : 'fail'
                });
                console.log(err);
                return;
            }

            res.status(StatusCodes.CREATED).json(results);
        }
    );
};


const deleteLike = (req, res) => {
    const {user_id, book_id} = req.body;

    const sql = 'delete from likes where user_id = ? and book_id = ?';
    const values = [user_id, book_id];

    conn.query(sql, values,
        (err, results) => {
            if (err) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message : 'fail'
                });
                console.log(err);
                return;
            }

            res.status(StatusCodes.OK).json(results);
        }
    );
};

module.exports = {
    createLike,
    deleteLike
};