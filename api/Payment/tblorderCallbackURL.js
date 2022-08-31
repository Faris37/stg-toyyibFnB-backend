const express = require("express"); // MUST HAVE
const router = express.Router(); // MUST HAVE
const { Console } = require("console");
const fs = require("fs");
const logger = require("../../function/logger");

router.post("/", async (req, res) => {
  let param = null;
  let result = null;

  let refno = null;
  let status = null;
  let reason = null;
  let billcode = null;
  let order_id = null;
  let amount = null;
  let transaction_time = null;

  try {
    // BIND PARAMETER TO VARIABLES
    param = req.body;

    refno = param.refno;
    status = param.status;
    reason = param.reason;
    billcode = param.billcode;
    order_id = param.order_id;
    amount = param.amount;
    transaction_time = param.transaction_time;

   
    logger.info( "refno: " + refno + " status: " + status + " reason: " + reason + " billcode: " + billcode + " order_id: " + order_id + " amount: " + amount + " transaction_time: " + transaction_time);

    console.log("param");
    result = {
      status: 200,
      message: "Success",
      //   data: param,
    };
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
