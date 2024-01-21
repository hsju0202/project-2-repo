const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const createLike = (req, res) => {
    const user = req.user;
    const {bookId} = req.body;

    const sql = 'insert into likes (user_id, book_id) values (?, ?)';
    const values = [user.id, bookId];

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
    const user = req.user;
    const {bookId} = req.body;

    const sql = 'delete from likes where user_id = ? and book_id = ?';
    const values = [user.id, bookId];

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