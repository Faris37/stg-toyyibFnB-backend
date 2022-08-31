const express = require("express"); // MUST HAVE
const router = express.Router(); // MUST HAVE


router.post("/", async (req, res) => {
    let param = null;
    let result = null;


    let refno = null;
    let status = null;
    let reason = null;
    let billcode = null;
    let order_id = null;
    let amount = null;
    let transaction_time = null;


    try {

        // BIND PARAMETER TO VARIABLES
        param = req.body;

        refno = param.refno;
        status = param.status;
        reason = param.reason;
        billcode = param.billcode;
        order_id = param.order_id;
        amount = param.amount;
        transaction_time = param.transaction_time;

        result = {
            response: 200,
            status: "berjaya",
            message: "Callback Berjaya.",
            data:param,
        };

    } catch (error) {
        console.log(error); // LOG ERROR
        result = {
            message: `API Error`,
        };
    }
    res.status(200).json(result);
});

module.exports = router;