const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const findCategories = (req, res) => {
    const sql = 'select * from categories';
    conn.query(sql,
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
    findCategories
};