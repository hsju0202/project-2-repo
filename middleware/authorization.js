const {StatusCodes} = require('http-status-codes');
const jwt = require('jsonwebtoken');
const {UnauthorizedError} = require('../middleware/errorHandler');

const checkAuthAndSetUser = (req, res, next) => {
    const receivedJwt = req.headers['authorization'];

    if (!receivedJwt) {
        next(new UnauthorizedError()); //TODO: 인가 미들웨어 추가시에 삭제할 수 있을듯
    }

    let decodedJwt;
    try {
        decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
    }
    catch (err) {
        if (!err instanceof jwt.TokenExpiredError) {
            next(err);
        }
        
        console.log(err);
        // TODO : 토큰 갱신해주기
        // decoedJwt = refreshToken(req.headers['refresh']);
    }

    req.user = {
        id : decodedJwt.id,
        email : decodedJwt.email
    }

    next();
};

module.exports = checkAuthAndSetUser;