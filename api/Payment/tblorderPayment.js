const express = require("express"); // MUST HAVE
const router = express.Router(); // MUST HAVE
const model = require("../../function/Payment.js"); // INCLUDE FUNCTION FILE

// MAKE SURE METHOD IS CORRECT WHEN CALLING API

// GET USER
router.post("/", async (req, res) => {

    let param = null;
    let result = null;
    let billName = null;
    let billDesc = null;
    let billAmount = null;
    let billExternalReferenceNo = null;
    let billTo = null;
    let billPhone = null;
    let orderNo = null;
    let serviceCharge = null;
    let discount = null;
    let tax = null;

    try {
        // GET USER FUNCTION
        param = req.body;
        serviceCharge = param.serviceCharge;
        discount = param.discount;
        tax = param.tax;
        billName = param.billName;
        billDesc = param.billDesc;
        billAmount = param.billAmount;
        billExternalReferenceNo = param.billExternalReferenceNo;
        billTo = param.billTo;
        billPhone = param.billPhone;
        orderNo = param.orderNo;

        console.log("BIll Name: ", billName)
        console.log("billDesc: ", billDesc)
        console.log("billAmount: ", billAmount)
        console.log("billExternalReferenceNo: ", billExternalReferenceNo)
        console.log("billTo: ", billTo)
        console.log("billPhone: ", billPhone)

        const createBill = await model.createBill(
            billName,
            billDesc,
            billAmount,
            billExternalReferenceNo,
            billTo,
            billPhone,
            orderNo,
            serviceCharge, discount, tax,
        );

        if (!createBill) return;

        else {
            console.log('BILL CODE RETURNED FROM TOYYIBPAY => ' + createBill)

            data2 = process.env.REDIRECT_PAYMENT_PAGE + createBill; //local atau staging
            // data2 = process.env.REDIRECT_PAYMENT_PAGE + createBill + '?billBankID=' + selectedBank; //production
            console.log("data 2: ", data2)
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
