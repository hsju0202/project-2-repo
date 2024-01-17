// const conn = require('../mariadb');
const mysql = require('mysql2/promise');
const {StatusCodes} = require('http-status-codes');

const order = async (req, res) => {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'Bookshop',
        dateStrings: true
      });

    const {userId, cartItemIds, delivery, firstBookTitle, totalQuantity, totalPrice} = req.body;

    let sql = 'insert into deliveries (address, receiver, contact) values (?, ?, ?)';
    let values = [delivery.address, delivery.receiver, delivery.contact];
    let [results] = await conn.execute(sql, values);
    const deliveryId = results.insertId;

    sql = 'insert into orders (user_id, book_title, total_quantity, total_price, delivery_id) values (?, ?, ?, ?, ?)';
    values = [userId, firstBookTitle, totalQuantity, totalPrice, deliveryId];
    [results] = await conn.execute(sql, values);
    const orderId = results.insertId;

    sql = 'select book_id, quantity from cart_items where id in (?)';
    const [orderItems] = await conn.query(sql, [cartItemIds]);
    console.log(orderItems);

    sql = 'insert into ordered_books (order_id, book_id, quantity) values ?';
    values = [];
    orderItems.forEach(item => {
        values.push([orderId, item.book_id, item.quantity]);
    });

    [results] = await conn.query(sql, [values]);

    deleteCartItem(conn, cartItemIds);

    res.status(StatusCodes.CREATED).json(results);
};

const deleteCartItem = async (conn, cartItemIds) => {
    const sql = 'delete from cart_items where id in (?)';
    const values = [];

    const result = await conn.query(sql, [cartItemIds]);

    return result;
}

const findOrders = async (req, res) => {
    const {userId} = req.body;

    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'Bookshop',
        dateStrings: true
      });
    
    const sql = `select o.id,
                        o.book_title,
                        o.total_quantity,
                        o.total_price,
                        o.created_at,
                        d.address,
                        d.receiver,
                        d.contact
                   from orders o left join deliveries d on o.delivery_id = d.id
                  where o.user_id = ?`;
    
    const [results] = await conn.execute(sql, [userId]);
    
    res.status(StatusCodes.OK).json(results);
};

const findOrderById = async (req, res) => {
    const id = parseInt(req.params.id);

    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'Bookshop',
        dateStrings: true
      });

    const sql = `select b.id,
                        b.title,
                        b.author,
                        b.price,
                        o.quantity 
                   from ordered_books o left join books b on o.book_id = b.id
                  where order_id = ?`;

    const [results] = await conn.execute(sql, [id]);

    res.status(StatusCodes.OK).json(results);
};

module.exports = {
    order,
    findOrders,
    findOrderById
}