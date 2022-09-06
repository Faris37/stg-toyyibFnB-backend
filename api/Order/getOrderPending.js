const express = require("express"); // MUST HAVE
const router = express.Router(); // MUST HAVE
const model = require("../../function/Order"); // INCLUDE FUNCTION FILE

router.get("/", async (req, res) => {
    let result = null;
    let param = null;
    
    
    try {
        const pendingOrder = await model.getOrderPending();
    
        if (pendingOrder == false) {
            result = {
                status: 200,
                message: `No Data`,
            };
        }
    
        if (pendingOrder) {
        result = {
            status: 200,
            message: "Success",
            data: pendingOrder,
        };
        } 
    } catch (error) {
        // console.log(error); // LOG ERROR
    
        result = {
        status: 500,
        message: `API Error`,
        data: error,
        };
    }
    
    // RETURN
    res.status(200).json(result);
});
module.exports = router;
