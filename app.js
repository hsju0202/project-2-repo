const dotenv = require('dotenv');
const express = require('express');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

app.listen(process.env.PORT);
app.use(express.json());
app.use(cookieParser());

const userRouter = require('./routes/users');
const bookRouter = require('./routes/books');
const categoryRouter = require('./routes/categories');
const cartRouter = require('./routes/carts');
const likeRouter = require('./routes/likes');
const orderRouter = require('./routes/orders');

app.use('/users', userRouter);
app.use('/books', bookRouter);
app.use('/categories', categoryRouter);
app.use('/carts', cartRouter);
app.use('/likes', likeRouter);
app.use('/orders', orderRouter);

const {handleError} = require('./middleware/errorHandler');

app.use(handleError);