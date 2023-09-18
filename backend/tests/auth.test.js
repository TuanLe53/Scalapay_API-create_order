const request = require("supertest");
const app = require("../app");
const pool = require("../database/db")

describe("POST /auth/register", () => {
    it("should create a new user", async () => {
        const res = await request(app).post("/auth/register").send(
            {
                username: "username",
                email: "thisisanemail@gmail.com",
                password: "012345678"
            }
        )
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("User added to database. Please login");
    });

    it("Email already in use", async () => {
        const res = await request(app).post("/auth/register").send(
            {
                username: "username",
                email: "user@gmail.com",
                password: "012345678"
            }
        )
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Email already in use, please use different email.");
    });
});

describe("POST /auth/login", () => {
    it("login user", async () => {
        const res = await request(app).post("/auth/login").send(
            {
                email: "test@gmail.com",
                password: "123456"
            }
        )
        expect(res.statusCode).toBe(200);
        expect(res.body.hasOwnProperty("accessToken"))
    });

    it("access denied", async () => {
        const res = await request(app).post("/auth/login").send(
            {
                email: "test@gmail.com",
                password: "wrongPassword"
            }
        )
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Please enter correct password")
    });
});

afterEach((done) => {
    pool.query("DELETE FROM users WHERE email = $1", ["thisisanemail@gmail.com"], (err) => {
        if (err) {
            console.error(err)
        }
    })
    done();
});