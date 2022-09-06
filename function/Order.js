const knex = require("../connection.js");
const moment = require("moment");

function getDateTime() {
  return moment().format("YYYY-MM-DD HH:mm:ss");
}

async function insertOrder(total, order, table) {
  let result = null;

  try {
    let sqlGetStatus = await knex
      .connect("reference")
      .select("referenceName", "referenceValue")
      .where("referenceValue", 3)
      .andWhere("referenceRefCode", 4);


    var mmberDisc = order[0].membership_no;

    var discountOutlet = 0;
    var Discount = 0;
    var mmbrDisc = 0;
    var tax = total * 0.06;
    var service = total * 0.1;
    if (total >= 70) {
      discountOutlet = total * 0.1;
    }
    else {
      discountOutlet = 0;
    }
    if (mmberDisc != "") {
      mmbrDisc = total * 0.07;
    }
    else {
      mmbrDisc = 0;
    }
    Discount = discountOutlet + mmbrDisc;
    var totalAmount = total + tax + service - Discount;


    let orderNo = await generateOrderID(4).then((res) => {
      return res;
    });

    let sql = await knex.connect("order").insert({
      orderNo: orderNo,
      orderStatusCode: sqlGetStatus[0].referenceValue,
      orderDatetime: getDateTime(),
      orderAmount: total,
      orderTotalAmount: totalAmount.toFixed(2),
      orderDetail: JSON.stringify(order),
      orderCustomerName: order[0].custName,
      orderCustomerPhoneNo: order[0].custPhone,
      fkCounterId: 1,
      orderFrom: "Table",
      orderTableNo: table,
      orderDiscount: Discount,
      orderTax: tax,
      orderServiceCharge: service
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

async function insertmenuOrder(order, insertOrder) {
  let result = null;

  try {
    for (let i = 0; i < order.length; i++) {
      let sqlGetStatus = await knex
        .connect("reference")
        .select("referenceName", "referenceValue")
        .where("referenceValue", 3)
        .andWhere("referenceRefCode", 4);

      let sql = await knex.connect("menu_order").insert({
        menuOrderQuantity: order[i].menu_quantity,
        menuOrderStatusCode: sqlGetStatus[0].referenceValue,
        menuOrderStatusRefName: sqlGetStatus[0].referenceName,
        menuOrderPrice: order[i].menu_price,
        menuOrderDetail: order[i],
        fkOrderId: insertOrder,
        fkMenuId: order[i].menu_id,
        menuOrderTypeOrderRefCode: order[i].orderType,
        menuOrderRemark: order[i].remarks,
      });
      console.log("Insert Menu Order: ", sql);
    }

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

async function updateOrdertbl(total, order, orderID) {
  let result = null;

  try {
    console.log("total :", total);
    var tax = total * 0.06;
    var service = total * 0.1;
    var totalAmount = total + tax + service;

    console.log("tax :", tax);
    console.log("service :", service);
    console.log("totalAmount :", totalAmount);

    let sql = await knex
      .connect("order")
      .update({
        orderDatetime: getDateTime(),
        orderAmount: total,
        orderTotalAmount: totalAmount,
        orderDetail: JSON.stringify(order),
      })
      .where("orderId", orderID);

    console.log("tax :", tax);
    console.log("service :", service);
    console.log("totalAmount :", totalAmount);

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

async function updatemenuOrdertbl(order, orderID) {
  let result = null;
  try {
    let sqlinCart = await knex
      .connect("reference")
      .select("referenceName", "referenceValue")
      .where("referenceValue", 3)
      .andWhere("referenceRefCode", 4);

    let sqlcancelled = await knex
      .connect("reference")
      .select("referenceName", "referenceValue")
      .where("referenceValue", 4)
      .andWhere("referenceRefCode", 4);

    let sqlupdateCancelled = await knex
      .connect("menu_order")
      .update({
        menuOrderStatusCode: sqlcancelled[0].referenceValue,
        menuOrderStatusRefName: sqlcancelled[0].referenceName,
      })
      .where("fkOrderId", orderID);

    console.log("Order :", order);
    for (let i = 0; i < order.length; i++) {
      let sql = await knex.connect("menu_order").insert({
        menuOrderQuantity: order[i].menu_quantity,
        menuOrderStatusCode: sqlinCart[0].referenceValue,
        menuOrderStatusRefName: sqlinCart[0].referenceName,
        menuOrderPrice: order[i].menu_price,
        menuOrderDetail: order[i],
        fkOrderId: orderID,
        fkMenuId: order[i].menu_id,
        menuOrderTypeOrderRefCode: order[i].orderType,
        menuOrderRemark: order[i].remarks,
      });
    }

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

async function getOrder(orderID) {
  let result = null;

  result = await knex
    .connect(`order`)
    .select("orderDetail", "orderAmount", "orderNo")
    .where(`orderID`, orderID);

  return result;
}

async function getOrderPOS(counter) {
  let result = null;
  let sql = null;
  let sqlGetCounter = await knex
    .connect("counter")
    .select("counterId")
    .where("counterSecretKey", counter);

  try {
    if (sqlGetCounter.length > 0) {
      sql = await knex
        .connect("order")
        .join("transaction", "order.orderId", "transaction.fkOrderId")
        .select(
          "transactionInvoiceNo AS invoice_no",
          "transactionMethodCode AS payment_method",
          "transactionFPXTransactionId AS fpx_transaction_id",
          "transactionCardInvoiceNo AS card_invoice_no",
          "transactionStatusCode AS payment_status",
          "transactionDatetime AS payment_datetime",
          "orderDatetime AS order_date",
          "orderNo AS order_no",
          "orderTotalAmount AS order_total_amount",
          "orderDetail AS order_detail"
        )
        .where("transaction.fkCounterId", sqlGetCounter[0].counterId);
    }

    if (!sql || sql.length == 0 || sqlGetCounter.length == 0) {
      result = false;
    } else {
      result = sql;
    }
  } catch (error) {
    console.log(error);
  }

  return result;
}

async function getOrderCart(orderid) {
  let result = null;

  result = await knex
    .connect(`order`)
    .select("orderDetail as order_details", "orderAmount as order_amount")
    .where(`orderID`, orderid);

  return result;
}

async function getOrderConfirm(billCode) {
  let result = null;

  result = await knex
    .connect("order")
    .select(
      "orderDetail as order_detail",
      "orderTotalAmount as ordertotal_amount",
      "orderNo as order_no",
      "orderTableNo as table_no",
      "orderTax as tax",
      "orderServiceCharge as service",
      "orderDiscount as discount",
      "orderDatetime as order_date",
      "transactionInvoiceNo as transac_no"
    )
    .join("transaction", "order.orderId", "=", "transaction.fkOrderID")
    .where("transaction.tpBillCode", billCode);

  return result;
}

async function generateOrderID(length) {
  let result1 = "";
  let result2 = "";
  let result3 = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  for (let i = 0; i < length; i++) {
    result2 += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  for (let i = 0; i < length; i++) {
    result3 += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result1 + "-" + result2 + "-" + result3;
}

async function insertOrderPOS(
  amount,
  total_amount,
  order,
  staff_id,
  counter_key,
  discount
) {
  let result = null;
  let tax = amount * 0.06;
  let service = amount * 0.1;
  let totalAmount = amount + tax - discount;

  let orderNo = await generateOrderID(4).then((res) => {
    return res;
  });

  let sqlGetStatusCompleted = await knex
    .connect("reference")
    .select("referenceName", "referenceValue")
    .where("referenceValue", 1)
    .andWhere("referenceRefCode", 4);

  let sqlGetStatusInCart = await knex
    .connect("reference")
    .select("referenceName", "referenceValue")
    .where("referenceValue", 3)
    .andWhere("referenceRefCode", 4);

  let sqlGetCounter = await knex
    .connect("counter")
    .select("counterId")
    .where("counterSecretKey", counter_key)
    .andWhere("counterStatusCode", 1);

  //   console.log(orderId);
  try {
    let sql = await knex.connect("order").insert({
      orderNo: orderNo,
      orderStatusCode: sqlGetStatusInCart[0].referenceValue,
      orderDatetime: getDateTime(),
      orderAmount: amount,
      orderTotalAmount: totalAmount,
      orderCustomerName: "Customer Name",
      orderCustomerPhoneNo: "Customer Phone",
      orderDetail: JSON.stringify(order),
      orderDiscount: discount,
      orderTax: tax,
      orderServiceCharge: 0,
      fkStaffId: staff_id,
      fkCounterId: sqlGetCounter[0].counterId,
    });

    if (!sql || sql.length == 0) {
      result = false;
    } else {
      result = orderNo;
    }
  } catch (error) {
    console.log(error);
  }

  return result;
}

async function insertmenuOrderPOS(order, orderNo) {
  let result = null;
  let sql = null;

  let sqlGetStatusCompleted = await knex
    .connect("reference")
    .select("referenceName", "referenceValue")
    .where("referenceValue", 1)
    .andWhere("referenceRefCode", 4);

  let sqlGetStatusInCart = await knex
    .connect("reference")
    .select("referenceName", "referenceValue")
    .where("referenceValue", 3)
    .andWhere("referenceRefCode", 4);

  let sqlGetOrderId = await knex
    .connect("order")
    .select("orderId")
    .where("orderNo", orderNo);

  try {
    for (let i = 0; i < order.length; i++) {
      sql = await knex.connect("menu_order").insert({
        menuOrderQuantity: order[i].menu_quantity,
        menuOrderStatusCode: sqlGetStatusInCart[0].referenceValue,
        menuOrderStatusRefName: sqlGetStatusInCart[0].referenceName,
        menuOrderPrice: order[i].menu_price,
        menuOrderDetail: order[i],
        // menuOrderTypeOrderRefCode: order[i].refOrderType,
        // menuOrderTypeOrderRefName: order[i].orderType,
        fkOrderId: sqlGetOrderId[0].orderId,
        fkMenuId: order[i].menu_id,
      });
    }

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

async function updateOrderPOS(
  amount,
  total_amount,
  order,
  discount,
  order_no,
  type
) {
  let result = null;
  let tax = amount * 0.06;
  let service = amount * 0.1;
  let totalAmount = amount + tax - discount;

  let orderNo = order_no;

  let sqlGetStatusInCart = await knex
    .connect("reference")
    .select("referenceName", "referenceValue")
    .where("referenceValue", 3)
    .andWhere("referenceRefCode", 4);

  let status = null;

  let selectStatusOrder = await knex
    .connect("order")
    .select("orderStatusCode")
    .where("orderNo", orderNo);

  if (type == "payment") {
    status = 1;
  } else if (type == "edit") {
    if (selectStatusOrder[0].orderStatusCode == 2) {
      status = 2;
    } else if (selectStatusOrder[0].orderStatusCode == 3) {
      status = 3;
    }
  }

  //   console.log(orderId);
  try {
    let sql = await knex
      .connect("order")
      .update({
        orderStatusCode: status,
        orderDatetime: getDateTime(),
        orderAmount: amount,
        orderTotalAmount: totalAmount,
        orderDetail: JSON.stringify(order),
        orderDiscount: discount,
        orderTax: tax,
        orderServiceCharge: 0,
      })
      .where("orderNo", orderNo);

    if (!sql || sql.length == 0) {
      result = false;
    } else {
      result = orderNo;
    }
  } catch (error) {
    console.log(error);
  }

  return result;
}

async function updateMenuOrderPOS(order, orderNo, type) {
  let result = null;
  let sql = null;
  let sqlNotExist = null;
  let sqlCancel = null;
  let sqlGetStatusOrder = null;

  if (type == "payment") {
    sqlGetStatusOrder = await knex
      .connect("reference")
      .select("referenceName", "referenceValue")
      .where("referenceValue", 1)
      .andWhere("referenceRefCode", 4);
  } else {
    sqlGetStatusOrder = await knex
      .connect("reference")
      .select("referenceName", "referenceValue")
      .where("referenceValue", 3)
      .andWhere("referenceRefCode", 4);
  }

  let sqlGetOrderId = await knex
    .connect("order")
    .select("orderId")
    .where("orderNo", orderNo);

  let sqlGetMenuOrder = await knex
    .connect("menu_order")
    .select("menuOrderId", "fkMenuId as menu_id")
    .where("fkOrderId", sqlGetOrderId[0].orderId);

  //   let orderParsed = JSON.parse(order);

  let orderExist = order.filter((item) => {
    return sqlGetMenuOrder.some((item2) => {
      return item2.menu_id === item.menu_id;
    });
  });

  let orderNotExist = order.filter((item) => {
    return !sqlGetMenuOrder.some((item2) => {
      return item2.menu_id === item.menu_id;
    });
  });

  let menuOrderExistCancel = sqlGetMenuOrder.filter((item) => {
    return !orderExist.some((item2) => {
      return item2.menu_id === item.menu_id;
    });
  });

  try {
    if (menuOrderExistCancel.length > 0) {
      for (let i = 0; i < menuOrderExistCancel.length; i++) {
        sqlCancel = await knex
          .connect("menu_order")
          .update({
            menuOrderStatusCode: 4,
            menuOrderStatusRefName: "Cancelled",
          })
          .where("menuOrderId", menuOrderExistCancel[i].menuOrderId);
      }
    }

    if (orderExist.length > 0) {
      for (let i = 0; i < orderExist.length; i++) {
        sql = await knex
          .connect("menu_order")
          .update({
            menuOrderQuantity: orderExist[i].menu_quantity,
            menuOrderStatusCode: sqlGetStatusOrder[0].referenceValue,
            menuOrderStatusRefName: sqlGetStatusOrder[0].referenceName,
            menuOrderPrice: orderExist[i].menu_price,
            menuOrderDetail: JSON.stringify(orderExist[i]),
            // menuOrderTypeOrderRefCode: order[i].refOrderType,
            // menuOrderTypeOrderRefName: order[i].orderType,
            // fkMenuId: orderExist[i].menu_id,
          })
          .where("fkOrderId", sqlGetOrderId[0].orderId)
          .andWhere("fkMenuId", orderExist[i].menu_id);
      }
    }

    if (orderNotExist.length > 0) {
      for (let i = 0; i < orderNotExist.length; i++) {
        sqlNotExist = await knex.connect("menu_order").insert({
          menuOrderQuantity: orderNotExist[i].menu_quantity,
          menuOrderStatusCode: sqlGetStatusOrder[0].referenceValue,
          menuOrderStatusRefName: sqlGetStatusOrder[0].referenceName,
          menuOrderPrice: orderNotExist[i].menu_price,
          menuOrderDetail: JSON.stringify(orderNotExist[i]),
          // menuOrderTypeOrderRefCode: order[i].refOrderType,
          // menuOrderTypeOrderRefName: order[i].orderType,
          fkOrderId: sqlGetOrderId[0].orderId,
          fkMenuId: orderNotExist[i].menu_id,
        });
      }
    }

    // if (!sql || sql.length == 0) {
    //   result = false;
    // } else {
    //   result = sql[0];
    // }

    result = true;
  } catch (error) {
    console.log(error);
  }

  return result;
}

async function getOrderPending() {
  let result = null;
  let sql = null;

  try {
    sql = await knex
      .connect("order")
      .select(
        "orderNo as order_no",
        "orderDatetime as order_datetime",
        "orderAmount as order_amount",
        "orderTotalAmount as order_total_amount",
        "orderCustomerName as order_customerName",
        "orderCustomerPhoneNo as order_customerPhoneNo",
        "orderStatusCode as order_status",
        "orderTableNo as order_tableNo"
      )
      .where("orderStatusCode", 2);

    if (!sql || sql.length == 0) {
      result = false;
    } else {
      result = sql;
    }
  } catch (error) {
    console.log(error);
  }

  return result;
}

async function getOrderCartPOS(order_no) {
  let result = null;

  result = await knex
    .connect(`order`)
    .select(
      "orderDetail as order",
      "orderAmount as amt",
      "orderTotalAmount as totalAmt",
      "orderDiscount as discount",
      "orderTax as tax",
      "orderServiceCharge as serviceCharge"
    )
    .where(`orderNo`, order_no);

  return result[0];
}

module.exports = {
  insertOrder,
  insertmenuOrder,
  updateOrdertbl,
  updatemenuOrdertbl,
  getOrder,
  insertOrderPOS,
  insertmenuOrderPOS,
  updateOrderPOS,
  updateMenuOrderPOS,
  getOrderCart,
  getOrderPOS,
  getOrderConfirm,
  getOrderPending,
  getOrderCartPOS,
};
