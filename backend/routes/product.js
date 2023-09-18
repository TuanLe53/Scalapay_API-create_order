const express = require("express")
const router = express.Router()
const productController = require("../controller/product/productController")

router.get("/", productController.getProducts)
router.get("/:id", productController.getProductByID)

module.exports = router