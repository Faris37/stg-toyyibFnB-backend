const express = require("express"); // MUST HAVE
const router = express.Router(); // MUST HAVE
const { Console } = require("console");
const fs = require("fs");
const logger = require("../../function/logger");
const parseMultiPart = require("express-parse-multipart");
const model = require("../../function/Payment.js");

router.post("/", parseMultiPart, async (req, res) => {
  let param = null;
  let result = null;

  let logText = null;
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

    refno = req.formData[0].data.toString();
    status = req.formData[1].data.toString();
    reason = req.formData[2].data.toString();
    billcode = req.formData[3].data.toString();
    order_id = req.formData[4].data.toString();
    amount = req.formData[5].data.toString();
    transaction_time = req.formData[11].data.toString();

    logText = `refno: ${refno}, status: ${status}, reason: ${reason}, billcode: ${billcode}, order_id: ${order_id}, amount: ${amount}, transaction_time: ${transaction_time}`;

    logger.info(logText);

    /* UPDATE SINI  */

    let updatePaymentTable = await model.updatePaymentTable(
      billcode,
      status,
      order_id
    );

    /* UPDATE */
    // console.log("req", req.body);
    console.log("refno", refno);
    result = {
      status: 200,
      message: "Success",
      data: updatePaymentTable,
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
