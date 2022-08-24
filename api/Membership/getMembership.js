const express = require("express"); // MUST HAVE
const router = express.Router(); // MUST HAVE
const model = require("../../function/Membership.js"); // INCLUDE FUNCTION FILE

router.post("/", async (req, res) => {
    let param = null;
    let result = null;


    let mmberID = null;

    try {

        // BIND PARAMETER TO VARIABLES
        param = req.body;

        mmberID = param.mmberID;
        
        let getMembership = await model.getMembership(
            mmberID
        )

        if (getMembership != false) {
            result = {
                status: 200,
                message: "Membership Wujud.",
                data: mmberID
            };
        } else {
            result = {
                status: "gagal",
                message: 'Membership Tidak Wujud'
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