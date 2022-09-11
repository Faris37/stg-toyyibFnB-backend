const express = require("express"); // MUST HAVE
const router = express.Router(); // MUST HAVE
const model = require("../../function/Order.js"); // INCLUDE FUNCTION FILE

// MAKE SURE METHOD IS CORRECT WHEN CALLING API

// GET USER
router.post("/", async (req, res) => {

    let param = null;
    let result = null;
    let billcode = null;
    let transactionId = null;

    try {

        param = req.body;

        billcode = param.billCode;
        transactionId = param.transactionId;

        // GET USER FUNCTION
        const getOrderConfirm = await model.getOrderConfirm(
            billcode,
            transactionId,
        );

        if (!getOrderConfirm) return;

        result = {
            response: 200,
            message: "Successfull List of Order",
            environment: process.env.ENVIRONMENT,
            data: getOrderConfirm
        };
    } catch (error) {
        console.log(error); // LOG ERROR
        result = {
            message: `API Error`,
        };
    }

    // RETURN
    res.status(200).json(result);
});

module.exports = router;