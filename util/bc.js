const bcrypt = require("bcryptjs");
let { genSalt, hash, compare } = bcrypt;
const { promisify } = require("util");

genSalt = promisify(genSalt);
hash = promisify(hash);
compare = promisify(compare);

module.exports.compare = compare;
module.exports.hash = hash;
module.exports.hash = plainText =>
    genSalt().then(salt => hash(plainText, salt));

// //the salt is different at each time
// genSalt()
//     .then(salt => {
//         //generate salt to add for more PW security
//         console.log("salt created by bcrypt:", salt);
//         return hash("safepassword", salt);
//     })
//     .then(hashedPw => {
//         //returns properly-hashed password
//         // console.log("hashedPw", hashedPw);
//
//         //clearText value compares that own hashed to
//         return compare("safePassword", hashedPw);
//     })
//     .then(matchValueCompare => {
//         console.log("password is a match", matchValueCompare);
//     });
//
// //once we created the salt, we need to run the hash
