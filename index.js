const express = require("express");
const app = express();
const hb = require("express-handlebars");
const db = require("./util/db");
const { hash, compare } = require("./util/bc.js");
const cookieSession = require("cookie-session");
const csurf = require("csurf");

const {
    requireSignature,
    requireLoggedOutUser,
    requireNoSignature
} = require("./middleware.js");

let loggedIn = false;

app.engine("handlebars", hb());
app.set("view engine", "handlebars");

app.use(express.static("./public"));

app.use(
    express.urlencoded({
        extended: false
    })
);

app.use((req, res, next) => {
    next();
});

//cookie session
app.use(
    cookieSession({
        secret: `The secret is used to generate the second cookie used to verify
        the integrity of the first cookie`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

//csurf
app.use(csurf());

app.use((req, res, next) => {
    res.set("x-frame-options", "deny");
    res.locals.csrfToken = req.csrfToken();
    next();
});

//homepage
app.get("/petition", (req, res) => {
    if (loggedIn == true) {
        res.render("petition", {
            loggedIn: "loggedIn"
        });
    } else {
        res.render("petition", {
            layout: "main"
        });
    }
});

//redirecting to homepage
app.get("/", (req, res) => {
    res.redirect("/petition");
});

//////////////// AUTH ROUTES ////////
//////////////////////////////////

app.post("/petition", requireLoggedOutUser, (req, res) => {
    let first = req.body.first;
    let last = req.body.last;
    let email = req.body.email;
    let password = req.body.password;

    if (req.body.password === "") {
        return res.render("petition", {
            error: "error"
        });
    } else {
        hash(password).then(hashedPw => {
            password = hashedPw;

            db.registerUser(first, last, email, password)
                .then(result => {
                    req.session.userId = result.rows[0].id;

                    res.redirect("/profile");
                })
                .catch(err => {
                    console.log("error", err);
                    res.render("petition", {
                        error: "error"
                    });
                });
        });
    }
});

app.get("/login", requireLoggedOutUser, (req, res) => {
    res.render("login", {
        layout: "main"
    });
});

app.post("/login", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    db.verifyUser(email)
        .then(result => {
            let passwordDB = result.rows[0].password;
            compare(password, passwordDB)
                .then(matchValue => {
                    if (matchValue) {
                        let id = result.rows[0].id;
                        req.session.userId = id;

                        loggedIn = true;

                        db.verifyIfSigned(id)
                            .then(result => {
                                req.session.signatureId = result.rows[0].id;

                                res.redirect("/thankyou");
                            })
                            .catch(err => {
                                res.redirect("/sign");
                            });
                    } else {
                        res.render("login", { error: "error" });
                    }
                })
                .catch(err => {
                    console.log("error", err);
                    res.render("login", { error: "error" });
                });
        })
        .catch(err => {
            console.log("error", err);
            res.render("login", { error: "error" });
        });
});

app.post("/logout", (req, res) => {
    req.session.userId = null;
    loggedIn = false;
    res.redirect("/petition");
});

//////////////// SIGN ////////
//////////////////////////////////

app.get("/sign", requireNoSignature, (req, res) => {
    res.render("sign", {
        layout: "main"
    });
});

app.post("/sign", requireNoSignature, (req, res) => {
    let signature = req.body.signature;
    let user_id = req.session.userId;

    db.addSigner(signature, user_id)
        .then(result => {
            req.session.signatureID = result.rows[0].id;
            res.redirect("/thankyou");
        })
        .catch(err => {
            console.log("error", err);
            res.redirect("/thankyou");
        });
});

app.get("/signers", requireSignature, (req, res) => {
    db.getSigners()
        .then(result => {
            res.render("signers", {
                signers: result.rows,
                helpers: {
                    addLink() {
                        if (result.rows.website !== null) {
                            res.render("signers", { signers: result.rows });
                        }
                    }
                }
            });
        })
        .catch(err => {
            console.log("error", err);
            res.redirect("/petition");
        });
});

app.get("/signers/:city", requireSignature, (req, res) => {
    let city = req.params.city;

    db.filterByCity(city)
        .then(result => {
            res.render("signers", {
                signers: result.rows,
                helpers: {
                    addLink() {
                        if (result.rows.website !== null) {
                            res.render("signers", { signers: result.rows });
                        }
                    }
                }
            });
        })
        .catch(err => {
            console.log("error", err);
        });
});

//////////PROFILE //////////
///////////////////////////

app.get("/profile", (req, res) => {
    res.render("profile", {
        layout: "main"
    });
});

app.post("/profile", (req, res) => {
    let user_id = req.session.userId;
    let website = req.body.website;

    if (!website.startsWith("http://") || !website.startsWith("https://")) {
        req.body.website = null;
    }

    db.addProfileInfo(req.body.age, req.body.city, req.body.website, user_id)
        .then(result => {
            res.redirect("/sign");
        })
        .catch(err => {
            console.log("error", err);
            res.redirect("/sign");
        });
});

app.get("/profile/edit", function(req, res) {
    let id = req.session.userId;

    db.getInfoForUpdate(id)
        .then(result => {
            res.render("editprofile", {
                first: result.rows[0].first,
                last: result.rows[0].last,
                email: result.rows[0].email,
                password: result.rows[0].password,
                age: result.rows[0].age,
                city: result.rows[0].city,
                website: result.rows[0].website
            });
        })
        .catch(err => {
            console.log("error in /profile/edit", err);
            res.render("editprofile", {
                error: "error"
            });
        });
});

app.post("/profile/edit", function(req, res) {
    let first = req.body.first;
    let last = req.body.last;
    let email = req.body.email;
    let password = req.body.password;
    let id = req.session.userId;
    let age = req.body.age;
    let city = req.body.city;
    let website = req.body.website;

    if (!website.startsWith("http://") || !website.startsWith("https://")) {
        req.body.website = null;
    }

    if (password === "") {
        db.updateInfoNoPass(first, last, email)
            .then(result => {})
            .then(() => {
                db.updateProfile(age, city, req.body.website, id)
                    .then(result => {
                        res.redirect("/profile/updated");
                    })
                    .catch(err => {
                        console.log("error", err);
                        res.render("editprofile", { error: "error" });
                    });
            })
            .catch(err => {
                console.log("error", err);
                res.render("editprofile", { error: "error" });
            });
    } else {
        hash(password).then(hashedPw => {
            password = hashedPw;

            db.updateInfoWithPass(first, last, email, password, id).then(() => {
                db.updateProfile(age, city, website, id)
                    .then(result => {
                        res.redirect("/profile/updated");
                    })
                    .catch(err => {
                        console.log("error", err);
                        res.render("editprofile", { error: "error" });
                    })
                    .catch(err => {
                        console.log("error", err);
                        res.render("editprofile", { error: "error" });
                    });
            });
        });
    }
});

app.get("/profile/updated", function(req, res) {
    res.render("profile_updated");
});

//////////////// THANK YOU ////////
//////////////////////////////////

app.get("/thankyou", requireSignature, function(req, res) {
    db.getSignature(req.session.userId)
        .then(result => {
            req.session.signatureID = result.rows[0].id;

            res.render("thankyou", { signature: result.rows[0].signature });
        })
        .catch(err => {
            console.log("error", err);
            res.redirect("/petition");
        });
});

app.get("/signature_deleted", function(req, res) {
    res.render("signature_deleted");
});

app.post("/thankyou/delete_signature", function(req, res) {
    db.deleleSignature(req.session.userId)
        .then(result => {
            delete req.session.signatureID;
            res.redirect("/signature_deleted");
        })
        .catch(err => {
            console.log("deletesignature  error", err);
        });
});

app.listen(process.env.PORT || 8080, () => console.log("server running"));
