const supertest = require("supertest");
const { app } = require("./index.js");
const cookieSession = require("cookie-session");

test("POST /petition sets req.session.userId", () => {
    const cookie = {};
    cookieSession.mockSessionOnce(cookie);
    return supertest(app)
        .post("/welcome")
        .then(() => {
            expect(cookie.userId).toBe(true);
        });
});

test("Users who log in and have not signed the petition are redirected to the /sign page, instead of the /thankyou page", () => {
    cookieSession.mockSession({
        userId: 34,
        sigId: null
    });
    return supertest(app)
        .get("/thankyou")
        .then(res => {
            expect(res.statusCode).toBe(302);
            expect(res.headers.location).toBe("/sign");
        });
});
