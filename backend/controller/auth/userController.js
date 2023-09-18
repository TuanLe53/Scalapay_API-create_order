const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config;
const pool = require("../../database/db");

const registerUser = async (req, res) => {
    const { username, password, email } = req.body
    
    try {
        const data = await pool.query("SELECT * FROM users WHERE email = $1", [email])
        const arr = data.rows
        //Check if user exist
        if (arr.length != 0) {
            res.status(400).json({error : "Email already in use, please use different email."})
        } else {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    console.error(err)
                    return res.status(500).json({ error: "Server error" });
                }

                //Create user
                const user = {
                    username,
                    email,
                    password: hash,
                }
                pool.query("INSERT INTO users(username, email, password) VALUES($1, $2, $3)", [user.username, user.email, user.password], (err) => {
                    if (err) {
                        console.error(err)
                        res.status(500).json({error: "Database error"})
                    } else {
                        res.status(201).send({
                            message: "User added to database. Please login"
                        })
                    }
                })
            })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Database error while registering user"})
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body
    try {
        const data = await pool.query("SELECT id, username,password FROM users WHERE email=$1", [email])
        const user = data.rows
        
        //User is not found
        if (user.length === 0) {
            res.status(400).json({error: "User is not found. Please sign up first"})
        } else {
            bcrypt.compare(password, user[0].password, function (err, result) {
                if (err) {
                    console.error(err)
                    res.status(500).json({error: "Server error"})
                } else if (result === true) {
                    //Create JWT
                    const accessToken = jwt.sign(
                        {
                            "username": user[0].username,
                            "id": user[0].id
                        },
                        process.env.ACCESS_TOKEN_SECRET,
                        {expiresIn: 60 * 5}
                    )
                    const refreshToken = jwt.sign(
                        {
                            "username": user[0].username,
                            "id": user[0].id
                        },
                        process.env.REFRESH_TOKEN_SECRET,
                        {expiresIn: "1d"}
                    )
                    modify_refresh_token(user, refreshToken)

                    res.cookie("jwt", refreshToken, { httpOnly: true, sameSite: "None", secure: true, maxAge: 24 * 60 * 60 * 1000 });
                    res.status(200).json({accessToken})
                } else {
                    if (result != true) {
                        res.status(400).json({error: "Please enter correct password"})
                    }
                }
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({error: "Database error occurred while signing in!"})
    }
}

const logoutUser = async (req, res) => {
    const cookies = req.cookies 
    if (!cookies?.jwt) return res.sendStatus(204) 
    const refreshToken = cookies.jwt

    const data = await pool.query("SELECT id, username, email FROM users LEFT JOIN refresh_token ON users.id = refresh_token.user_id WHERE refresh_token.refresh_token = $1", [refreshToken])
    const user = data.rows
    if (user.length === 0) { 
        res.clearCookie("jwt", {httpOnly: true, sameSite: 'None', secure: true })
        return res.sendStatus(204)
    }
    pool.query("DELETE FROM refresh_token WHERE user_id = $1", [user[0].id])
    res.clearCookie("jwt", { httpOnly: true, sameSite: 'None', secure: true })
    res.sendStatus(204)
}

const modify_refresh_token = async (user, refreshToken) => {
    const check_token = await pool.query("SELECT * FROM refresh_token WHERE user_id = $1", [user[0].id])

    //Insert if not exist
    if (check_token.rows.length === 0) {
        pool.query("INSERT INTO refresh_token(user_id, refresh_token) VALUES($1, $2)", [user[0].id, refreshToken])
    } else {
        //Update token
        pool.query("UPDATE refresh_token SET refresh_token = $1, valid_from = NOW(), valid_until = NOW() + INTERVAL '1 DAY' WHERE user_id = $2",[refreshToken, user[0].id])
    }
}

module.exports = { registerUser, loginUser, logoutUser};