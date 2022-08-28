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
    let order_no = param.order_no;

    let updateOrder = await model.updateOrderPOS(
      amt,
      totalAmount,
      order,
      staffId,
      counter,
      discount,
      order_no
    );

    let updateMenuOrder = await model.updateMenuOrderPOS(order, updateOrder);

    if (updateOrder || updateMenuOrder) {
      result = {
        status: 200,
        message: "Success Update",
        data: updateOrder,
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
