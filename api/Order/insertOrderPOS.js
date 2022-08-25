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
    let staffId = param.staffId;
    let tableId = param.tableId;
    let counterId = param.counterId;
    let discount = param.discount;
    let tax = param.tax;
    let serviceCharge = param.serviceCharge;

    let insertOrder = await model.insertOrderPOS(
      amt,
      totalAmount,
      order,
      1,
      1,
      discount,
      tax,
      serviceCharge
    );

    let insertmenuOrder = await model.insertmenuOrderPOS(order, insertOrder);

    if (insertOrder || insertmenuOrder != false) {
      result = {
        status: 200,
        message: "Success",
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
