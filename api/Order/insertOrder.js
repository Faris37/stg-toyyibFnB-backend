const express = require("express"); // MUST HAVE
const router = express.Router(); // MUST HAVE
const model = require("../../function/Order.js"); // INCLUDE FUNCTION FILE

router.post("/", async (req, res) => {
    let param = null;
    let result = null;


    let order = [];
    let total = null;
    let table = null;
    

    try {

        // BIND PARAMETER TO VARIABLES
        param = req.body;

        order = param.order;
        total = param.total;
        table = param.table;

        let insertOrder = await model.insertOrder(
            total,
            order,
            table,
        )

        let insertmenuOrder = await model.insertmenuOrder(
            order,
            insertOrder,
        )

        if (insertOrder != false || insertmenuOrder != false) {
            result = {
                response: 200,
                status: "berjaya",
                message: "Anda berjaya masukkan Order.",
                data: insertOrder
            };
        } else {
            result = {
                status: "gagal",
                message: 'Anda gagal masukkan Order'
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