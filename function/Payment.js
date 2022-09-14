const knex = require("../connection.js");
const moment = require("moment");
const { pad } = require("crypto-js");
const axios = require("axios");

function getDateTime() {
  return moment().format("YYYY-MM-DD HH:mm:ss");
}

async function generateInvoiceNo(orderId) {
  let result = null;
  let randomNo = Math.floor(Math.random() * 1000 + 1);
  let strOrderId = String("00000" + orderId).slice(-5);
  let strRandomNo = String("0000" + randomNo).slice(-4);

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

  try {
    let sql = await knex.connect("transaction").insert({
      transactionInvoiceNo: invoiceNo,
      transactionDatetime: getDateTime(),
      transactionStatusCode: 1,
      transactionAmount: totalAmount,
      transactionAmountNett: totalAmount,
      transactionMethodCode: paymentMethod,
      transactionCardInvoiceNo: ccInvoiceNo != null ? ccInvoiceNo : null,
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

async function createBill(billName, billDesc, billAmount, billExternalReferenceNo, billTo, billPhone, orderNo, serviceCharge, discount, tax) {

  let result = [];

  const params = new URLSearchParams();

  // required data
  params.append('userSecretKey', process.env.SECRET_KEY); /* LETAK ENV */
  params.append('categoryCode', process.env.CATEGORY_CODE);
  params.append('billName', billName);
  params.append('billDescription', billDesc);
  params.append('billPriceSetting', 1);
  params.append('billPayorInfo', 0);

  params.append('billAmount', billAmount);
  params.append('billReturnUrl', 'https://toyyibfnb.com/order/confirm');
  params.append('billCallbackUrl', 'https://toyyibfnb.com/api/tbl/callbackPayment');/* https://toyyibfnb.com/api/tbl/tblorderCallbackURL */
  params.append('billExternalReferenceNo', orderNo); /* Order No ORDER */
  params.append('billTo', billTo);
  params.append('billEmail', 'Farisizwanfauzi@gmail.com');
  params.append('billPhone', billPhone);

  /* params.append('billAmount', billAmount); */
  // params.append('billReturnUrl', 'http://bizapp.my');
  /* params.append('billCallbackUrl', 'http://localhost:3000/tbl/callbackPayment'); */
  params.append('billTo', 'test');
  params.append('billEmail', 'hishamudin.ali@gmail.com');
  params.append('billPhone', '0123123123');

  params.append('billPaymentChannel ', 1);
  params.append('billChargeToCustomer', 1);

  console.log(params);

  /* returnURL receipt */
  /* await axios.post(process.env.CREATE_BILL, params)
    .then(function (response) { */

  await axios.post('https://dev.toyyibpay.com/index.php/api/createBill', params)
    .then(function (response) {

      console.log(response.data)
      result = response.data[0].BillCode
    })
    .catch(function (error) {
      result = error
      console.log(error)
    });

  /* MASUK DLM TABLE TRANSACTION */
  let sqlGetOrderId = await knex
    .connect("order")
    .select("orderId", "orderTotalAmount")
    .where("orderNo", orderNo);


  let invoiceNo = await generateInvoiceNo(sqlGetOrderId[0].orderId).then(
    (res) => {
      return res;
    }
  );

  try {
    let sql = await knex.connect("transaction").insert({
      transactionInvoiceNo: invoiceNo,
      transactionDatetime: getDateTime(),
      transactionStatusCode: 4,
      transactionAmount: sqlGetOrderId[0].orderTotalAmount,
      transactionAmountNett: sqlGetOrderId[0].orderTotalAmount,
      tpBillCode: result,
      transactionServiceCharge: serviceCharge,
      transactionDiscount: discount,
      transactionTax: tax,
      paymentStatus: 1,
      transactionPayorName: "Customer Name",
      transactionPayorPhoneNo: "Customer Phone",
      fkOrderId: sqlGetOrderId[0].orderId,
      transactionMethodCode: 2,
    });

    if (!sql || sql.length == 0) {
      resu = false;
    } else {
      resu = sql[0];
    }
  } catch (error) {
    console.log(error);
  }

  return result;

  /* }) */
}

async function updatePaymentTable(billcode, status) {

  let result = null;

  try {
    let statusSelect = null;

    if (status == 1) {
      statusSelect = await knex.connect("reference")
        .select("referenceValue", "referenceName")
        .where("referenceRefCode", 16)
        .andWhere("referenceValue", 1);
    }
    else if (status == 2) {
      statusSelect = await knex.connect("reference")
        .select("referenceValue", "referenceName")
        .where("referenceRefCode", 16)
        .andWhere("referenceValue", 2);
    }
    else if (status == 3) {
      statusSelect = await knex.connect("reference")
        .select("referenceValue", "referenceName")
        .where("referenceRefCode", 16)
        .andWhere("referenceValue", 3);
    }

    let sql = await knex.connect("transaction").update({
      transactionStatusCode: statusSelect[0].referenceValue,
      paymentDatetimeCallback: getDateTime(),
    }).where("tpBillCode", billcode);

    let updateOrder = await knex.connect("order")
      .join("transaction", "order.orderId", "=", "transaction.fkOrderID")
      .update({ orderStatusCode: statusSelect[0].referenceValue, })
      .where("transaction.tpBillCode", billcode)

    let sqlSelect = await knex.connect("transaction")
      .select("fkOrderID")
      .where("tpBillCode", billcode);

    let sqlmenu_order = await knex.connect("menu_order")
      .update({
        menuOrderStatusRefName: "Completed",
        menuOrderStatusCode: 1
      })
      .where("fkOrderId", sqlSelect[0].fkOrderID)
      .andWhere("menuOrderStatusCode", 3);

    if (!updateOrder || updateOrder.length == 0) {
      result = false;
    } else {
      result = updateOrder[0];
    }
  } catch (error) {
    console.log(error);
  }

  return updateOrder;
}

async function tblorderPaymentPOS(serviceCharge, discount, tax, total, customerName, customerPhone, orderID) {

  let result;

  let invoiceNo = await generateInvoiceNo(orderID).then(
    (res) => {
      return res;
    }
  );

  try {
    /* let sql = await knex.connect("transaction").insert({
      transactionInvoiceNo: invoiceNo,
      transactionDatetime: getDateTime(),
      transactionStatusCode: 2,
      transactionAmount: total,
      transactionAmountNett: total,
      transactionMethodCode: 1,
      transactionServiceCharge: serviceCharge,
      transactionDiscount: discount,
      transactionTax: tax,
      paymentStatus: 2,
      transactionPayorName: customerName,
      transactionPayorPhoneNo: customerPhone,
      fkOrderId: orderID,
      fkCounterId: 1,
    }); */


    let sqlUpdate = await knex.connect("order")
      .where("orderId", orderID)
      .update({
        orderStatusCode: 2,
        orderDiscount: discount,
        orderTax: tax,
        orderServiceCharge: serviceCharge,
        fkCounterId: 1,
        orderFrom: "Table"
      });

    let sqlOrderNO = await knex.connect("order")
      .select("orderNo as order_no")
      .where("orderId", orderID);

    if (!sqlOrderNO || sqlOrderNO.length == 0) {
      result = false;
    } else {
      result = sqlOrderNO[0];
    }
  } catch (error) {
    console.log(error);
  }

  return result;
}


module.exports = {
  insertPaymentPOS,
  tblorderPayment,
  createBill,
  updatePaymentTable,
  tblorderPaymentPOS,
};
