const pool = require("../../database/db")

const getProducts = async (req, res) => {
    try {
        let data = await pool.query("SELECT id, name, price, image FROM product")
        let products = data.rows
        res.status(200).json(products)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Database error"})
    }
}

const getProductByID = async (req, res) => {
    let id = req.params.id
    
    try {
        let data = await pool.query("SELECT * FROM product WHERE id = $1", [id])
        let pd = data.rows[0]
        res.status(200).json(pd)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Database error"})
    }
}

module.exports = {getProducts, getProductByID}