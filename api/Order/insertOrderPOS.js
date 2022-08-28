const express = require("express"); // MUST HAVE
const router = express.Router(); // MUST HAVE
const model = require("../../function/Order"); // INCLUDE FUNCTION FILE

router.post("/", async (req, res) => {
  let param = null;
  let result = null;

  try {
    // BIND PARAMETER TO VARIABLES
    param = req.body;
    let order = param.order;
    let totalAmount = param.totalAmt;
    let amt = param.amt;
    let staffId = param.staff;
    let tableId = param.tableId;
    let counter = param.counter;
    let discount = param.discount;

    let insertOrder = await model.insertOrderPOS(
      amt,
      totalAmount,
      order,
      staffId,
      counter,
      discount
    );

    let insertmenuOrder = await model.insertmenuOrderPOS(order, insertOrder);

    if (insertOrder || insertmenuOrder != false) {
      result = {
        status: 200,
        message: "Success",
        data: insertOrder,
      };
    } else {
      result = {
        status: 500,
        message: "Failed",
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
