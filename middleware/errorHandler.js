const {StatusCodes} = require('http-status-codes');

class BusinuessLogicError extends Error {
    constructor(message, name, statusCode) {
        super(message);
        this.name = name;
        this.statusCode = statusCode;
    }
}

class UndefinedError extends BusinuessLogicError {
    constructor(stack) {
        super(
            '알 수 없는 에러입니다. 관리자에게 문의해주세요.',
            'UndefinedError',
            StatusCodes.BAD_REQUEST
        );
    }
}

class UnauthorizedError extends BusinuessLogicError {
    constructor() {
        super(
            '로그인 되지 않은 사용자입니다.',
            'UnauthorizedError',
            StatusCodes.UNAUTHORIZED
        );
    }
}

class NotUserOwnCartItem extends BusinuessLogicError {
    constructor() {
        super(
            '사용자의 장바구니 아이템이 아닙니다.',
            'NotUserOwnCartItem',
            StatusCodes.BAD_REQUEST
        );
    }
}

const handleError = (err, req, res, next) => {
    if (!err instanceof BusinuessLogicError) {
        const stack = err.stack;
        err = new UndefinedError(stack);
    }
    
    const log = `[err] : ${err.name}\n[code] : ${err.statusCode}\n[stack]: ${err.stack}\n[param] : ${req}\n[date] : ${new Date()}`;
    console.log(log);

    res.status(err.statusCode).json({
        message : err.message
    });
};

module.exports = {
    handleError,
    UnauthorizedError
};