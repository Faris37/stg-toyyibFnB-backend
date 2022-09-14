const express = require("express"); // MUST HAVE
const router = express.Router(); // MUST HAVE
const model = require("../../function/Payment"); // INCLUDE FUNCTION FILE
const modelOrder = require("../../function/Order"); // INCLUDE FUNCTION FILE

router.post("/", async (req, res) => {
  let param = null;
  let result = null;

  try {
    param = req.body;
    let totalAmount = param.totalAmt;
    let amount = param.amt;
    let counter = param.counter;
    let discount = param.discount;
    let tax = param.tax;
    let serviceCharge = param.serviceCharge;
    let paymentMethod = param.payment_method;
    let customer = param.customer;
    let ccInvoiceNo = param.cc_invoiceNo;
    let order_no = param.order_no;
    let order = param.order.order;
    let order_takeaway = [];
    let order_typeId = param.orderTypeId;

    // order = JSON.parse(order.order);
    console.log("order", order);

    let insertPayment = await model.insertPaymentPOS(
      amount,
      totalAmount,
      counter,
      discount,
      paymentMethod,
      customer,
      ccInvoiceNo,
      order_no
    );

    let updateOrder = await modelOrder.updateOrderPOS(
      amount,
      totalAmount,
      order,
      discount,
      order_no,
      "payment",
      order_takeaway
    );

    let updateMenuOrder = await modelOrder.updateMenuOrderPOS(
      order,
      updateOrder,
      "payment",
      order_takeaway,
      order_typeId
    );

    // update order & menu order

    if (
      insertPayment != false ||
      updateOrder != false ||
      updateMenuOrder != false
    ) {
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
