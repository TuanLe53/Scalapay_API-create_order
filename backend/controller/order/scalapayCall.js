const pool = require("../../database/db");
const fs = require("fs")

const request = require('api')('@scalapaydocs/v1.1#5ryqsdllosocp4');

request.auth('Bearer qhtfs87hjnc12kkos');

const scalaPayAPI = async (req, res) => {
    let { order_id, api_obj } = req.body
    let consumer = api_obj["consumer"]

    try {
        let result = await request.postV2Orders(api_obj)
        
        //create consumer's info
        pool.query("INSERT INTO order_consumer(order_id, given_name, surname, email, phonenumber) VALUES($1, $2, $3, $4, $5)", [order_id, consumer["givenNames"], consumer["surname"], consumer["email"], consumer["phoneNumber"]], (err) => {
            if (err) {
                console.error(err)
                return res.status(500).json({ error: "Database error" })
            }
        })

        //update order
        pool.query("UPDATE orders SET total_price = $1, is_check = $2 WHERE id = $3", [api_obj["totalAmount"]["amount"], "t", order_id], (err) => {
            if (err) {
                console.error(err)
                pool.query("DELETE FROM order_consumer WHERE order_id = $1", [order_id])
                return res.status(500).json({ error: "Database error" })
            }
        })
        //update product quantity
        const data = await pool.query("SELECT product.id, product.quantity, ordered_pd.quantity AS order_quantity FROM ordered_pd JOIN product ON ordered_pd.pd_id = product.id WHERE order_id = $1", [order_id])
        for await (const pd of data.rows) {
            let new_quantity = pd.quantity - pd.order_quantity
            pool.query("UPDATE product SET quantity = $1 WHERE id = $2", [new_quantity, pd.id], (err) => {
                //if error 
                if (err) {
                    fs.appendFile("updateDB_err.txt", `Failed to update ${pd.id}'s quantity from ${pd.quantity} to ${new_quantity}.\n`, (err) => {
                        if (err) throw err
                    })
                }
            })
        }

        res.status(200).json(result.data)
    } catch (error) {
        console.log(error.data.message.errors)
        return res.status(400).json({ error: "Something go wrong" })
    }
}

module.exports = scalaPayAPI;