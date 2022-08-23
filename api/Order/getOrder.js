const express = require("express"); // MUST HAVE
const router = express.Router(); // MUST HAVE
const model = require("../../function/Order.js"); // INCLUDE FUNCTION FILE

// MAKE SURE METHOD IS CORRECT WHEN CALLING API

// GET USER
router.post("/", async (req, res) => {

    let param = null;
    let result = null;

    try {

        param = req.body;

        orderID = param.iOrder;

        // GET USER FUNCTION
        const getOrder = await model.getOrder(
            orderID,
        );

        if (!getOrder) return;

        result = {
            response: 200,
            message: "Successfull List of Order",
            environment: process.env.ENVIRONMENT,
            data: {
                d3t4ilOrd3r: getOrder[0]['orderDetail'],
                am0untOrd3r: getOrder[0]['orderAmount']
            }
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