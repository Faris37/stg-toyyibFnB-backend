const express = require("express"); // MUST HAVE
const router = express.Router(); // MUST HAVE
const model = require("../../function/Order.js"); // INCLUDE FUNCTION FILE

router.post("/", async (req, res) => {
    let param = null;
    let result = null;


    let order = [];
    let total = null;
    let orderID = null;
    let discount = null;
    

    try {

        // BIND PARAMETER TO VARIABLES
        param = req.body;

        order = param.order;
        total = param.total;
        orderID = param.orderID;
        discount = param.discounted;

        let updateOrdertbl = await model.updateOrdertbl(
            total,
            order,
            orderID,
            discount,
        )

        let updatemenuOrdertbl = await model.updatemenuOrdertbl(
            order,
            orderID
        )

        if (updateOrdertbl != false || updatemenuOrdertbl != false) {
            result = {
                response: 200,
                status: "berjaya",
                message: "Anda berjaya Kemaskini Order.",
                data: orderID
            };
        } else {
            result = {
                status: "gagal",
                message: 'Anda gagal Kemaskini Order'
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