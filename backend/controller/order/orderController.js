const pool = require("../../database/db")

const addToOrder = async (req, res) => {
    let {user_id, pd_id, quantity, total_price} = req.body

    try {
        let order_id;
        const data = await pool.query("SELECT id FROM orders WHERE NOT is_check AND user_id = $1", [user_id]) //get user's order which is_check = FALSE

        if (data.rows.length === 0) { // if return null create new one
            let result = await pool.query("INSERT INTO orders(user_id, is_check) VALUES($1, FALSE) RETURNING id", [user_id])
            order_id = await result.rows[0].id
            createOrderedPD(res, pd_id, order_id, quantity, total_price)
        } else {
            order_id = await data.rows[0].id
            createOrderedPD(res, pd_id, order_id, quantity, total_price)
        }
        
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Database error"})
    }
}

const getOrder = async (req, res) => {

    try {
        const order_id = (await pool.query("SELECT id FROM orders WHERE NOT is_check AND user_id = $1", [req.user.id])).rows[0].id
        const data = await pool.query("SELECT product.id, product.name, ordered_pd.quantity, ordered_pd.total_price, ordered_pd.currency FROM ordered_pd JOIN product ON ordered_pd.pd_id = product.id WHERE order_id = $1", [order_id])
        const order_pd = data.rows
        const order_total_price = (await pool.query("SELECT SUM(total_price) FROM ordered_pd WHERE order_id = $1", [order_id])).rows[0].sum
        const obj = {
            order_id,
            order_pd,
            order_total_price
        }
        res.status(200).json(obj)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Database error"})
    }
}

const createOrderedPD = (res, pd_id, order_id, quantity, total_price) => {
    pool.query("INSERT INTO ordered_pd(pd_id, order_id, quantity, total_price) VALUES($1, $2, $3, $4) RETURNING pd_id, order_id", [pd_id, order_id, quantity, total_price], (err, result) => {
        if (err) {
            console.error(err)
            return res.status(400).json({ error: "Product already added to order" })
        }
        res.status(201).json({
            "message": "Added to order",
            "product": result.rows[0]
        })
    })
}

module.exports = {addToOrder, getOrder}