module.exports = {
    requireLoggedOutUser(req, res, next) {
        if (req.session.userId) {
            res.redirect("/petition");
        } else {
            next();
        }
    },
    requireNoSignature(req, res, next) {
        if (req.session.signatureID) {
            res.redirect("/thanks");
        } else {
            next();
        }
    },
    requireSignature(req, res, next) {
        if (!req.session.signatureID) {
            res.redirect("/petition");
        } else {
            next();
        }
    }
};
