const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const findCartItems = (req, res) => {
    const {userId, selectedIds} = req.body;

    let sql = `select c.id,
                      c.book_id,
                      b.title,
                      b.summary,
                      c.quantity,
                      b.price
                 from cart_items c
                 left join books b on c.book_id = b.id
                where user_id = ?`;

    const values = [userId];

    if (selectedIds && selectedIds.length) {
        sql += ' and c.id in (?)';
        values.push(selectedIds);
    }

    conn.query(sql, values,
        (err, results) => {
            if (err) {
                console.log(err);
                res.status(StatusCodes.BAD_REQUEST).end();
                return;
            }

            res.status(StatusCodes.OK).json(results);
        }
    );
};

const addItem2Cart = (req, res) => {
    const {userId, bookId, quantity} = req.body;

    const sql = `insert into cart_items
                    (user_id, book_id, quantity)
                 values
                    (?, ?, ?)
                 on duplicate key update
                    quantity = ?`;
    const values = [userId, bookId, quantity, quantity];
    conn.query(sql, values,
        (err, results) => {
            if (err) {
                console.log(err);
                res.status(StatusCodes.BAD_REQUEST).end();
                return;
            }

            res.status(StatusCodes.OK).json(results);
        }
    );
};

const deleteItemFromCart = (req, res) => {
    const id = parseInt(req.params.id);

    const sql = 'delete from cart_items where id = ?';
    conn.query(sql, id,
        (err, results) => {
            if (err) {
                console.log(err);
                res.status(StatusCodes.BAD_REQUEST).end();
                return;
            }

            res.status(StatusCodes.OK).json(results);
        }
    );
};

module.exports = {
    addItem2Cart,
    deleteItemFromCart,
    findCartItems
};