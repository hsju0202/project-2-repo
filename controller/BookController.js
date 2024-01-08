const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const findBooks = (req, res) => {
    const {category_id, latest, page = 1, limit = 8} = req.query;

    let sql = `select b.id,
                      b.title,
                      b.image,
                      b.category_id,
                      c.category_name,
                      b.author,
                      b.summary,
                      b.price,
                      (select count(*) from likes where book_id = b.id) as likes,
                      b.pub_date
                 from books b 
                 left join categories c on b.category_id = c.id`;

    if (category_id || latest) {
        sql += ' where ';
    }

    const values = [];

    if (category_id) {
        sql += 'b.category_id = ?'
        values.push(category_id);
    }

    if (latest) {
        if (values.length) {
            sql += ' and ';
        }
        sql += 'b.pub_date between date_sub(now(), interval 1 month) and now()';
    }

    const offset = limit * (page - 1);
    values.push(parseInt(limit), offset);

    sql += ' limit ? offset ?';

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

const findBookById = (req, res) => {
    const id = parseInt(req.params.id);

    const sql = `select b.id,
                        b.title,
                        b.image,
                        b.category_id,
                        c.category_name,
                        b.form,
                        b.author,
                        b.isbn,
                        b.pages,
                        b.summary,
                        b.detail,
                        b.contents,
                        b.price,
                        (select count(*) from likes where book_id = b.id) as likes,
                        (select exists (select * from likes where user_id = 6 and book_id = b.id)) as isLiked,
                        b.pub_date
                   from books b
                   left join categories c on b.category_id = c.id
                   where b.id = ?`;

    conn.query(sql, id,
        (err, results) => {
            if (err) {
                console.log(err);
                res.status(StatusCodes.BAD_REQUEST).end();
                return;
            }

            const findBook = results[0];

            if (!findBook) {
                res.status(StatusCodes.NOT_FOUND).end();
                return;
            }

            res.status(StatusCodes.OK).json(findBook);
        }
    );
};

module.exports = {
    findBooks,
    findBookById
};