const express = require("express"); // MUST HAVE
const router = express.Router(); // MUST HAVE
const model = require("../../function/Order.js"); // INCLUDE FUNCTION FILE

// MAKE SURE METHOD IS CORRECT WHEN CALLING API

// GET USER
router.post("/", async (req, res) => {

    let param = null;
    let result = null;
    let orderid = null

    try {

        param = req.body;

        orderid = param.orderID;

        // GET USER FUNCTION
        const getOrderCart = await model.getOrderCart(
            orderid,
        );

        if (!getOrderCart) return;

        result = {
            response: 200,
            message: "Successfull List of Order",
            environment: process.env.ENVIRONMENT,
            data:getOrderCart
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