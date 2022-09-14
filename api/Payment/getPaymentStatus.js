const express = require("express"); // MUST HAVE
const router = express.Router(); // MUST HAVE
const model = require("../../function/Payment"); // INCLUDE FUNCTION FILE

router.get("/", async (req, res) => {

    let result = null;
    try {
        const getPaymentStatus = await model.getPaymentStatus();
    
        if (getPaymentStatus) {
        result = {
            status: 200,
            message: "Success",
            data: getPaymentStatus,
        };
        } else if (getPaymentStatus == false) {
        result = {
            status: 200,
            message: "No data",
        };
        }
    } catch (error) {
        console.log(error); // LOG ERROR
    
        result = {
        status: 500,
        message: `API Error`,
        };
    }
    
    // RETURN
    res.status(result.status).json(result);
});

module.exports = router;