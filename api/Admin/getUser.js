const express = require("express"); // MUST HAVE
const router = express.Router(); // MUST HAVE
const model = require("../../function/Admin.js"); // INCLUDE FUNCTION FILE
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotallySecretKey');

// MAKE SURE METHOD IS CORRECT WHEN CALLING API

// GET USER
router.get("/", async (req, res) => {

    let param = null;
    let result = null;
   

    try {
        // GET USER FUNCTION
        const getUserDetails = await model.getUserDetails(
        );

        /* const encryptedString = cryptr.encrypt(getDashboardDetails); */
        /*  */

        if (getUserDetails == false) {
            result = {
                status: 200,
                message: `No Data`,
            };
        }

        if (getUserDetails) {
            result = {
                status: 200,
                message: "Success",
                data: getUserDetails,
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