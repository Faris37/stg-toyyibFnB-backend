const express = require("express"); // MUST HAVE
const router = express.Router(); // MUST HAVE
const model = require("../../function/Payment.js"); // INCLUDE FUNCTION FILE

// MAKE SURE METHOD IS CORRECT WHEN CALLING API

// GET USER
router.post("/", async (req, res) => {

    let param = null;
    let result = null;
    let serviceCharge = null;
    let discount = null;
    let tax = null;
    let total = null;
    let customerName = null;
    let customerPhone = null;
    let orderID = null;
    

    try {
        // GET USER FUNCTION
        param = req.body;
        serviceCharge = param.serviceCharge;
        discount = param.discount;
        tax = param.tax;
        total = param.total;
        customerName = param.customerName;
        customerPhone = param.customerPhone;
        orderID = param.MenuID;

        const tblorderPaymentPOS = await model.tblorderPaymentPOS(
            serviceCharge ,discount, tax, total,customerName,customerPhone,orderID
        );


        if (tblorderPaymentPOS != "") {
            result = {
                response: 200,
                status: "Success",
                message: "successfully Insert Payment ",
                data: tblorderPaymentPOS
            };
        } else {
            result = {
                status: "Failed",
                message: 'Failed'
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
