const request = require("supertest");
const app = require("../app");
const pool = require("../database/db")

let token = null
let test_pd = {
    quantity: 2,
    price: 89.99,
    id: "b88ebfc5-f8e1-47bc-94eb-774c8d2c9578"
}

beforeEach((done) => {
    request(app).post("/auth/login")
        .send({ email: "test@gmail.com", password: "123456" })
        .end((err, res) => {
            token = res.body.accessToken;
            done();
        });
});

describe("GET /order/",  () => {
    it("should return an order", async () => {
        const res = await request(app).get(
            "/order/"
        ).set("Authorization", "Bearer " + token)
        expect(res.statusCode).toBe(200);
    });
});

describe("POST /order/add-product", () => {
    it("add a new ordered_product to order", async () => {
        const res = await request(app).post("/order/add-product").send(
            {
                user_id: "7cf7fded-1fcf-4815-8d8d-22f59eac6a53",
                total_price: test_pd.quantity * test_pd.price,
                quantity: 2,
                pd_id: test_pd.id
            }
        ).set("Authorization", "Bearer " + token);
        pool.query("DELETE FROM ordered_pd WHERE pd_id = $1 AND order_id = $2", [test_pd.id, res.body.product.order_id], (err) => {
            if (err) {
                console.error(err)
            }
        })
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("Added to order");
    });
});