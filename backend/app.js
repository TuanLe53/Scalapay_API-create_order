const express = require("express")
const app = express()
const cors = require("cors")
const cookieParser = require("cookie-parser")
const corsOptions = require("./config/CORS/corsOption");
const credentials = require("./middleware/credential")
const morgan = require('morgan');

require("dotenv").config()
const PORT = process.env.PORT || 3500

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use("/images/product", express.static("public/images/product"));
app.use("/auth", require("./routes/auth")); //auth route
app.use("/product", require("./routes/product")); //product route
app.use("/order", require("./routes/order")); //order route

module.exports = app