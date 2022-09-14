const express = require("express"); // MUST HAVE
const router = express.Router(); // MUST HAVE
const model = require("../../function/Admin.js"); // INCLUDE FUNCTION FILE
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotallySecretKey');

// MAKE SURE METHOD IS CORRECT WHEN CALLING API

// GET USER
router.post("/", async (req, res) => {

    let param = null;
    let result = null;
    let username = null;
    let password = null;

    try {

        param = req.body;

        username = param.username;
        password = param.password;

        // GET USER FUNCTION
        const loginCredentials = await model.loginCredentials(
            username,
            password,
        );
        
        const encryptedString = cryptr.encrypt(loginCredentials[0].staff_id);
        /* const decryptedString = cryptr.decrypt(encryptedString); */

        if (loginCredentials == false) {
            result = {
                status: 200,
                message: `No Data`,
            };
        }

        if (loginCredentials) {
            result = {
                status: 200,
                message: "Success",
                data: encryptedString,
            };
        }
    } catch (error) {
        // console.log(error); // LOG ERROR

        result = {
            status: 500,
            message: `API Error`,
            data: error,
        };


    }



    // RETURN
    res.status(200).json(result);
});

module.exports = router;