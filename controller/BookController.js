const conn = require('../mariadb');
const mysql = require('mysql2/promise');
const {StatusCodes} = require('http-status-codes');

const jwt = require('jsonwebtoken');

const findBooks = async (req, res) => {
    const {category_id, latest, page = 1, limit = 8} = req.query;

    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'Bookshop',
        dateStrings: true
      });

    let booksSql = `select b.id,
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
        booksSql += ' where ';
    }

    const values = [];

    if (category_id) {
        booksSql += 'b.category_id = ?'
        values.push(category_id);
    }

    if (latest) {
        if (values.length) {
            booksSql += ' and ';
        }
        booksSql += 'b.pub_date between date_sub(now(), interval 1 month) and now()';
    }

    const offset = limit * (page - 1);
    values.push(parseInt(limit), offset);

    booksSql += ' limit ? offset ?';

    const [books] = await conn.query(booksSql, values);

    const totalCountSql = 'select count(*) as totalCount from books';
    const [[{totalCount}]] = await conn.query(totalCountSql);

    res.status(StatusCodes.OK).json({
        books : books,
        pagination : {
            page : parseInt(page),
            totalCount : totalCount
        }
    });
};

const findBookById = (req, res) => {
    const receivedJwt = req.headers['authorization'];
    
    //TODO: 인가 미들웨어 개발시 삭제하면 될 것 같음.
    let userId;
    if (receivedJwt) {
        console.log('hello');
        decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
        userId = decodedJwt.id;
    }

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
                        if(isnull(?), 0, exists(select * from likes where user_id = ? and book_id = b.id)) as isLiked,
                        b.pub_date
                   from books b
                   left join categories c on b.category_id = c.id
                   where b.id = ?`;

    const values = [userId || null, userId || null, id];
    conn.query(sql, values,
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