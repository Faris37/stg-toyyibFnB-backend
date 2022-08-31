const express = require("express"); // MUST HAVE
const router = express.Router(); // MUST HAVE
const model = require("../../function/Payment.js"); // INCLUDE FUNCTION FILE

// MAKE SURE METHOD IS CORRECT WHEN CALLING API

// GET USER
router.post("/", async (req, res) => {
    let result = null;

    try {
        // GET USER FUNCTION
        const createBill = await model.createBill();

        if (!createBill) return;

        else {
            console.log('BILL CODE RETURNED FROM TOYYIBPAY => ' + createBill)

            data2 = process.env.REDIRECT_PAYMENT_PAGE + createBill; //local atau staging
            // data2 = process.env.REDIRECT_PAYMENT_PAGE + createBill + '?billBankID=' + selectedBank; //production
            console.log("data 2: ",data2)
        }
    } catch (error) {
        console.log(error); // LOG ERROR
        result = {
            status: 500,
            message: `API Error`,
        };
    }
    result = {
        environment: process.env.ENVIRONMENT,
        data2: data2,
      };
    
    // RETURN
    res.status(200).json(result);
});

module.exports = router;
