const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const join = (req, res) => {
    const {email, name, password} = req.body;

    const salt = crypto.randomBytes(parseInt(process.env.SALT_SIZE)).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt, parseInt(process.env.PASSWORD_HASH_ITER), parseInt(process.env.SALT_SIZE), process.env.PASSWORD_HASH_ALGO).toString('base64');

    const sql = 'insert into users (email, name, password, salt) values (?, ?, ?, ?)';
    const values = [email, name, hashPassword, salt];

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

const login = (req, res) => {
    const {email, password} = req.body;

    const sql = 'select * from users where email = ?';

    conn.query(sql, email,
        (err, results) => {
            if (err) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message : 'fail'
                });
                console.log(err);
                return; 
            }

            const loginUser = results[0];

            if (!loginUser) {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message : '이메일 또는 비밀번호가 틀렸습니다.'
                });
                return;
            }

            const hashPassword = crypto.pbkdf2Sync(password, loginUser.salt, parseInt(process.env.PASSWORD_HASH_ITER), parseInt(process.env.SALT_SIZE), process.env.PASSWORD_HASH_ALGO).toString('base64');
            
            if (loginUser.password !== hashPassword) {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message : '이메일 또는 비밀번호가 틀렸습니다.'
                });
                return;
            }

            const payload = {
                id : loginUser.id,
                email : loginUser.email
            };
            const options = {expiresIn : '5m'};
            const token = jwt.sign(payload, process.env.PRIVATE_KEY, options);

            res.cookie('token', token, {
                httpOnly : true
            });

            res.status(StatusCodes.OK).json({
                message : '로그인 성공'
            });
        }
    );
};

const requestResetPassword = (req, res) => {
    const {email} = req.body;

    const sql = 'select * from users where email = ?';

    conn.query(sql, email,
        (err, results) => {
            if (err) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message : 'fail'
                });
                console.log(err);
                return; 
            }

            const findUser = results[0];

            if (!findUser) {
                res.status(StatusCodes.UNAUTHORIZED).end();
                return; 
            }

            res.status(StatusCodes.OK).end();
        }
    );
};

const resetPassword = (req, res) => {
    const {token} = req.cookies;
    const {email} = jwt.verify(token, process.env.PRIVATE_KEY);

    const {newPassword} = req.body;

    const salt = crypto.randomBytes(parseInt(process.env.SALT_SIZE)).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt, parseInt(process.env.PASSWORD_HASH_ITER), parseInt(process.env.SALT_SIZE), process.env.PASSWORD_HASH_ALGO).toString('base64');

    const sql = 'update users set password = ?, salt = ? where email = ?';
    const values = [hashPassword, salt, email];

    conn.query(sql, values,
        (err, results) => {
            if (err) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message : 'fail'
                });
                console.log(err);
                return;
            }

            if (results.affectedRows === 0) {
                res.status(StatusCodes.BAD_REQUEST).end();
            }

            res.status(StatusCodes.OK).end();
        }
    ); 
};

module.exports = {
    join,
    login,
    requestResetPassword,
    resetPassword
};