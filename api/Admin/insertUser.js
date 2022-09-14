const express = require("express"); // MUST HAVE
const router = express.Router(); // MUST HAVE
const model = require("../../function/Admin.js"); // INCLUDE FUNCTION FILE

router.post("/", async (req, res) => {
    let param = null;
    let result = null;


   
    let fullname = null;
    let phone = null;
    let email = null;
    let address = null;
    

    try {

        // BIND PARAMETER TO VARIABLES
        param = req.body;

        fullname = param.fullname;
        phone = param.phone;
        email = param.email;
        address = param.address;

        let insertUser = await model.insertUser(
            fullname,
            phone,
            email,
            address,
        )

        if (insertUser != false ) {
            result = {
                response: 200,
                status: "Success",
                message: "Successfully Create New User",
                data: insertUser
            };
        } else {
            result = {
                status: "Fail",
                message: 'Failed to Create New User'
            }
        }


    } catch (error) {
        console.log(error); // LOG ERROR
        result = {
            message: `API Error`,
        };
    }
    res.status(200).json(result);
});

module.exports = router;