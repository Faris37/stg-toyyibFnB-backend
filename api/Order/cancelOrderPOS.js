const express = require("express"); // MUST HAVE
const router = express.Router(); // MUST HAVE
const model = require("../../function/Order"); // INCLUDE FUNCTION FILE

router.post("/", async (req, res) => {
  let param = null;
  let result = null;

  try {
    // BIND PARAMETER TO VARIABLES
    param = req.body;
    let order_no = param.order_no;

    console.log('order_noqqq', order_no);

    let cancelOrder = await model.cancelOrderPOS(order_no);

    let cancelMenuOrder = await model.cancelMenuOrderPOS(order_no);

    if (cancelOrder || cancelMenuOrder) {
      result = {
        status: 200,
        message: "Success Update",
        data: cancelOrder,
      };
    } else {
      result = {
        status: 500,
        message: "Failed Update",
      };
    }
  } catch (error) {
    console.log(error); // LOG ERROR
    result = {
      status: 500,
      message: `API Error`,
    };
  }

  res.status(result.status).json(result);
});

module.exports = router;
