const knex = require("../connection.js");
const moment = require("moment");
const { pad } = require("crypto-js");

function getDateTime() {
  return moment().format("YYYY-MM-DD HH:mm:ss");
}

async function generateInvoiceNo(orderId) {
  let result = null;
  let randomNo = Math.floor(Math.random() * 1000 + 1);
  let strOrderId = String("00000" + orderId).slice(-5);
  let strRandomNo = String("0000" + randomNo).slice(-4);

  console.log("randomNo", randomNo);
  console.log("strOrderId", strOrderId);
  console.log("strRandomNo", strRandomNo);

  result = "MG" + moment().format("YYMMDDHHmmss") + strOrderId + strRandomNo;
  return result;
}

async function insertPaymentPOS(
  amount,
  total_amount,
  counter,
  discount,
  paymentMethod,
  customer,
  ccInvoiceNo,
  orderNo
) {
  let result = null;
  let tax = amount * 0.06;
  let service = amount * 0.1;
  let totalAmount = (amount + tax - discount).toFixed(2);

  let sqlGetOrderId = await knex
    .connect("order")
    .select("orderId")
    .where("orderNo", orderNo);

  let invoiceNo = await generateInvoiceNo(sqlGetOrderId[0].orderId).then(
    (res) => {
      return res;
    }
  );

  console.log("orderno", orderNo);
  console.log("orderId", sqlGetOrderId[0].orderId);
  console.log(invoiceNo);

  try {
    let sql = await knex.connect("transaction").insert({
      transactionInvoiceNo: invoiceNo,
      transactionDatetime: getDateTime(),
      transactionStatusCode: 1,
      transactionAmount: totalAmount,
      transactionAmountNett: totalAmount,
      transactionMethodCode: paymentMethod,
      transactionServiceCharge: service,
      transactionDiscount: discount,
      transactionTax: tax,
      paymentStatus: 1,
      transactionPayorName: "Customer Name",
      transactionPayorPhoneNo: "Customer Phone",
      fkOrderId: sqlGetOrderId[0].orderId,
      fkCounterId: 1,
    });

    if (!sql || sql.length == 0) {
      result = false;
    } else {
      result = sql[0];
    }
  } catch (error) {
    console.log(error);
  }

  return result;
}

async function tblorderPayment() {
  let array = [];
  array = {
    'userSecretKey': 'w5x7srq7-rx5r-3t89-2ou2-k7361x2jewhn',
    'categoryCode': '1to0s08q',
    'billName': 'Order for',
    'billDescription': 'Order for Table 1',
    'billPriceSetting': 1,
    'billPayorInfo': 1,
    'billAmount': 100,
    'billReturnUrl': 'http://bizapp.my',/* http://localhost:8080/order/confirm */
    'billCallbackUrl': 'http://bizapp.my/paystatus', 
    'billExternalReferenceNo': 'Order No',
    'billTo': 'John Doe', /* Customer Name */
    'billEmail': 'jd@gmail.com', /* Email cust */
    'billPhone': '0194342411', /* Phone Cust */
    'billSplitPayment': 0,
    'billSplitPaymentArgs': '',
    'billPaymentChannel': '0',
    'billContentEmail': 'Thank you for purchasing our product!',
    'billChargeToCustomer': 1,
    'billExpiryDate': '',
    'billExpiryDays': ''
  }

  /* Axios */
}

module.exports = {
  insertPaymentPOS,
  tblorderPayment,
};
