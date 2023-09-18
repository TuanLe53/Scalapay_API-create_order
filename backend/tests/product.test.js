const request = require("supertest");
const app = require("../app");

describe("GET /product/", () => {
    it("should return all products", async () => {
        const res = await request(app).get("/product/");
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });
});

describe("GET /product/:id", () => {
    it("should return a product", async () => {
        const res = await request(app).get(
            "/product/10bd8076-b432-40c0-977b-c212a9872322"
        );
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe("jumping rope");
    });
});