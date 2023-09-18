const request = require("supertest");
const app = require("../app");
const pool = require("../database/db")

let test_pd = {
    quantity: 2,
    price: 181,
    id: "b88ebfc5-f8e1-47bc-94eb-774c8d2c9578"
}
let token = null
beforeEach( (done) => {
    request(app).post("/auth/login")
        .send({ email: "test_2@gmail.com", password: "123456" })
        .end((err, res) => {
            token = res.body.accessToken;
            done()
        });
});

describe("POST /order/check", () => {
    let order_id = null
    beforeEach((done) => {
        request(app).post("/order/add-product").set("Authorization", "Bearer " + token).send(
            {
                user_id: "0f49133a-7a87-4d9e-96fb-1f046913cb34",
                total_price: test_pd.quantity * test_pd.price,
                quantity: 2,
                pd_id: test_pd.id
            }).end((err, res) => {
                order_id = res.body.product.order_id
                done()
            })
    })

    it("send request to call Scalapay API", async () => {
        let obj = {
            order_id: order_id,
            api_obj: {
                totalAmount: {
                    currency: "EUR",
                    amount: "777"
                },
                consumer: {
                    givenNames: "givenName",
                    surname: "surname",
                    email: "",
                    phoneNumber: "",
                },
                taxAmount: {
                    currency: "EUR",
                    amount: "3.70"
                },
                shippingAmount: {
                    currency: "EUR",
                    amount: "10.00"
                },
                merchant: {
                    redirectCancelUrl: "https://portal.integration.scalapay.com/failure-url",
                    redirectConfirmUrl: "https://portal.integration.scalapay.com/success-url"
                },
                type: "online",
                orderExpiryMilliseconds: 600000,
                product: "pay-in-3"
            }
        }
        const res = await request(app).post("/order/check").set("Authorization", "Bearer " + token).set("Content-Type", "application/json").send(obj);

        expect(res.statusCode).toBe(200);
        expect(res.body.hasOwnProperty("checkoutUrl")) 
    })

})