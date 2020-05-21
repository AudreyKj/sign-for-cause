const spicePg = require("spiced-pg");

const db = spicePg(
    process.env.DATABASE_URL ||
        "postgres://postgres:postgres@localhost:5432/petition"
);

function registerUser(first, last, email, password) {
    return db.query(
        `INSERT INTO users(first, last, email, password)
   VALUES ($1, $2, $3, $4) RETURNING id`,
        [first, last, email, password]
    );
}

function verifyUser(email) {
    return db.query(`SELECT password, id FROM users where email=$1`, [email]);
}

function verifyIfSigned(id) {
    return db.query(
        `SELECT signatures.signature FROM signatures JOIN users ON users.id = signatures.user_id
        WHERE users.id = $1`,
        [id]
    );
}

function addSigner(signature, user_id) {
    return db.query(
        `INSERT INTO signatures( signature, user_id)
   VALUES ($1, $2) RETURNING id`,
        [signature, user_id]
    );
}

function addProfileInfo(age, city, website, user_id) {
    return db.query(
        `INSERT INTO user_profiles ( age, city,  website, user_id)
 VALUES ($1, $2, $3, $4) RETURNING id`,
        [age, city, website, user_id]
    );
}

function getSignature(user_id) {
    return db.query(
        `SELECT signature, id FROM signatures
   WHERE user_id=$1`,
        [user_id]
    );
}

function getSigners() {
    return db.query(
        `SELECT * FROM users JOIN user_profiles ON users.id = user_profiles.user_id`
    );
}

function filterByCity(city) {
    return db.query(
        `SELECT users.first, users.last, user_profiles.city,
        user_profiles.website, user_profiles.age
        FROM signatures
        JOIN users
        ON users.id = signatures.user_id
        LEFT JOIN user_profiles
        ON users.id = user_profiles.user_id
        WHERE LOWER(user_profiles.city) = LOWER($1)`,
        [city]
    );
}

function deleleSignature(id) {
    return db.query(
        `DELETE FROM signatures
        WHERE user_id = $1`,
        [id]
    );
}

function getInfoForUpdate(id) {
    return db.query(
        `SELECT users.first, users.last, users.email, user_profiles.age,
    user_profiles.city,user_profiles.website
    FROM users
    LEFT JOIN user_profiles
    ON users.id = user_profiles.user_id
    WHERE user_id=$1`,
        [id]
    );
}

function updateProfile(age, city, website, id) {
    return db.query(
        `INSERT INTO user_profiles (age, city,  website, user_id)
VALUES ($1, $2, $3, $4)
ON CONFLICT (user_id)
DO UPDATE SET age=$1, city=$2,  website=$4`,
        [age || null, city, website, id]
    );
}

function updateInfoWithPass(first, last, email, password, id) {
    return db.query(
        `UPDATE users SET first =$1, last =$2, email=$3,
password=$4 WHERE id=$5`,
        [first, last, email, password, id]
    );
}

exports.addSigner = addSigner;
exports.getSignature = getSignature;
exports.getSigners = getSigners;
exports.registerUser = registerUser;
exports.verifyUser = verifyUser;
exports.verifyIfSigned = verifyIfSigned;
exports.addProfileInfo = addProfileInfo;
exports.filterByCity = filterByCity;
exports.getInfoForUpdate = getInfoForUpdate;
exports.updateProfile = updateProfile;
exports.updateInfoWithPass = updateInfoWithPass;
exports.deleleSignature = deleleSignature;
