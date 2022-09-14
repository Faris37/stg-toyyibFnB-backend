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
    let staffid = "";

    try {

        param = req.body;

        staffid = param.staffid;
        const decryptedString = cryptr.decrypt(staffid);

        // GET USER FUNCTION
        const getDashboardDetails = await model.getDashboardDetails(
            decryptedString,
        );

        /* const encryptedString = cryptr.encrypt(getDashboardDetails); */
        /*  */

        if (getDashboardDetails == false) {
            result = {
                status: 200,
                message: `No Data`,
            };
        }

        if (getDashboardDetails) {
            result = {
                status: 200,
                message: "Success",
                data: getDashboardDetails,
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