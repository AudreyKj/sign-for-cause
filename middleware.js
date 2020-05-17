function requireLoggedOutUser(req, res, next) {
    if (req.session.userId) {
        return res.redirect("/petition");
    } else {
        next();
    }
}

function requireNoSignature(req, res, next) {
    if (req.session.signatureID) {
        return res.redirect("/thankyou");
    } else {
        next();
    }
}

function requireSignature(req, res, next) {
    if (!req.session.signatureID) {
        return res.redirect("/sign");
    } else {
        next();
    }
}

exports.requireLoggedOutUser = requireLoggedOutUser;
exports.requireNoSignature = requireNoSignature;
exports.requireSignature = requireSignature;
