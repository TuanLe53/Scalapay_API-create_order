const express = require("express")
const router = express.Router()
const orderController = require("../controller/order/orderController")
const scalaPayAPI = require("../controller/order/scalapayCall")
const verifyJWT = require("../middleware/verifyJWT")

router.post("/add-product", verifyJWT, orderController.addToOrder)
router.get("/", verifyJWT, orderController.getOrder)
router.post("/check", verifyJWT, scalaPayAPI)

module.exports = router