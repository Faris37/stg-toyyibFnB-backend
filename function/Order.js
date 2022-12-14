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
    /* var service = total * 0.1; */
    if (total >= 70) {
      discountOutlet = total * 0.1;
    } else {
      discountOutlet = 0.00;
    }
    if (mmberDisc != "") {
      mmbrDisc = total * 0.07;
    } else {
      mmbrDisc = 0.00;
    }
    Discount = discountOutlet + mmbrDisc;
    var totalAmount = total + tax  - Discount;

    var custName = order[0].custName;
    var custPhone = order[0].custPhone;
    if(custName == "")
    {
      custName = "Guest";
    }
    if(custPhone == "")
    {
      custPhone = "Guest"
    }

    var custName = order[0].custName;
    var custPhone = order[0].custPhone;
    if(custName == "")
    {
      custName = "Guest";
    }
    if(custPhone == "")
    {
      custPhone = "Guest"
    }

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
      orderCustomerName: custName,
      orderCustomerPhoneNo: custPhone,
      fkCounterId: 1,
      orderFrom: "Table",
      orderTableNo: table,
      orderDiscount: Discount,
      orderTax: tax,
      orderServiceCharge: 0.00,
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
      
      let menutype = order[i].orderType;
      let insertMenuType = "";
      if(menutype == 1 || menutype == "1")
      {
        insertMenuType = "Dine in";
      }
      else if(menutype == 2 || menutype == "2")
      {
        insertMenuType = "Take Away";
      }

      let sql = await knex.connect("menu_order").insert({
        menuOrderQuantity: order[i].menu_quantity,
        menuOrderStatusCode: sqlGetStatus[0].referenceValue,
        menuOrderStatusRefName: sqlGetStatus[0].referenceName,
        menuOrderPrice: order[i].menu_price,
        menuOrderDetail: order[i],
        fkOrderId: insertOrder,
        fkMenuId: order[i].menu_id,
        menuOrderTypeOrderRefCode: order[i].orderType,
        menuOrderTypeOrderRefName: insertMenuType,
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

async function updateOrdertbl(total, order, orderID, discounted) {
  let result = null;

  try {
    console.log("total :", total);
    var tax = total * 0.06;
    /* var service = total * 0.1; */
    var totalAmount = total + tax ;
    totalAmount = totalAmount - discounted;

    let sql = await knex.connect("order").update({
      orderDatetime: getDateTime(),
      orderAmount: total,
      orderTotalAmount: totalAmount,
      orderDiscount: discounted,
      orderTax: tax,
      orderDetail: JSON.stringify(order),
    }).where("orderId", orderID);


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

async function getOrderPOS() {
  let result = null;
  let sql = null;

  try {
    sql = await knex
      .connect("order")
      .leftJoin("staff", "staff.staffId", "order.fkStaffId")
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
        "orderDetail AS order_detail",
        "transactionTax as tax",
        "transactionServiceCharge as service_charge",
        "transactionDiscount as discount",
        "transactionAmountNett as amountNett",
        "staffName AS staff_name",
        "staffPhoneNo AS staff_phone_no",
        "staffEmail AS staff_email",
        "staffId AS staff_id",
      );

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

async function getOrderCart(orderid) {
  let result = null;

  result = await knex
    .connect(`order`)
    .select("orderDetail as order_details", "orderAmount as order_amount")
    .where(`orderID`, orderid);

  return result;
}

async function getOrderConfirm(billCode , transactionId) {
  let result = null;
  let sql = null;

  result = await knex
    .connect("order")
    .select(
      "orderDetail as order_detail",
      "orderTotalAmount as ordertotal_amount",
      "orderNo as order_no",
      "orderTableNo as table_no",
      "orderTax as tax",
      "orderDiscount as discount",
      "orderDatetime as order_date",
      "transactionInvoiceNo as transac_no"
    )
    .join("transaction", "order.orderId", "=", "transaction.fkOrderID")
    .where("transaction.tpBillCode", billCode);

  sql = await knex.connect("transaction").where("tpBillCode", billCode).update({paymentDatetimeReturnURL:getDateTime() , transactionTPNo:transactionId })

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
  discount,
  order_takeaway
) {
  let result = null;
  let tax = amount * 0.06;
  let service = amount * 0.1;
  let totalAmount = amount + tax - discount;

  let orderNo = await generateOrderID(4).then((res) => {
    return res;
  });

  let arrayOrder = [];

  if (order_takeaway.length > 0) {
    let orderConcat = order.map((item) => {
      let result = order_takeaway.map((item2) => {
        if (item.menu_id == item2.menu_id) {
          return {
            ...item,
            menu_quantity: item.menu_quantity + item2.menu_quantity,
          };
        } else {
          return item;
        }
      });

      console.log("result :", result[0]);
      arrayOrder.push(result[0]);

      return arrayOrder;
    });
  }

  console.log("arrayOrder :", arrayOrder);

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
      orderDetail:
        order_takeaway.length > 0
          ? JSON.stringify(arrayOrder)
          : JSON.stringify(order),
      orderDiscount: discount,
      orderTax: tax,
      orderServiceCharge: 0,
      orderFrom: "POS",
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

async function insertmenuOrderPOS(
  order,
  orderNo,
  order_takeaway,
  order_typeId
) {
  let result = null;
  let sql = null;
  let sql_takeaway = null;

  let sqlGetStatusInCart = await knex
    .connect("reference")
    .select("referenceName", "referenceValue")
    .where("referenceValue", 3)
    .andWhere("referenceRefCode", 4);

  let sqlGetOrderId = await knex
    .connect("order")
    .select("orderId")
    .where("orderNo", orderNo);

  let sqlGetTypeOrder = await knex
    .connect("reference")
    .select("referenceName", "referenceValue")
    .where("referenceValue", order_typeId)
    .andWhere("referenceRefCode", 9);

  try {
    for (let i = 0; i < order.length; i++) {
      sql = await knex.connect("menu_order").insert({
        menuOrderQuantity: order[i].menu_quantity,
        menuOrderStatusCode: sqlGetStatusInCart[0].referenceValue,
        menuOrderStatusRefName: sqlGetStatusInCart[0].referenceName,
        menuOrderPrice: order[i].menu_price,
        menuOrderDetail: order[i],
        menuOrderTypeOrderRefCode: sqlGetTypeOrder[0].referenceValue,
        menuOrderTypeOrderRefName: sqlGetTypeOrder[0].referenceName,
        fkOrderId: sqlGetOrderId[0].orderId,
        fkMenuId: order[i].menu_id,
      });
    }

    if (order_takeaway.length > 0) {
      for (let i = 0; i < order_takeaway.length; i++) {
        sql_takeaway = await knex.connect("menu_order").insert({
          menuOrderQuantity: order_takeaway[i].menu_quantity,
          menuOrderStatusCode: sqlGetStatusInCart[0].referenceValue,
          menuOrderStatusRefName: sqlGetStatusInCart[0].referenceName,
          menuOrderPrice: order_takeaway[i].menu_price,
          menuOrderDetail: order_takeaway[i],
          menuOrderTypeOrderRefCode: 2,
          menuOrderTypeOrderRefName: "Take Away",
          fkOrderId: sqlGetOrderId[0].orderId,
          fkMenuId: order_takeaway[i].menu_id,
        });
      }
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
  type,
  order_takeaway
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

  let arrayOrder = [];

  if (order_takeaway.length > 0) {
    let orderConcat = order.map((item) => {
      let result = order_takeaway.map((item2) => {
        if (item.menu_id == item2.menu_id) {
          return {
            ...item,
            menu_quantity: item.menu_quantity + item2.menu_quantity,
          };
        } else {
          return item;
        }
      });

      console.log("result :", result[0]);
      arrayOrder.push(result[0]);

      return arrayOrder;
    });
  }

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
        orderDetail: order_takeaway.length > 0 ? JSON.stringify(arrayOrder) : JSON.stringify(order),
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

async function updateMenuOrderPOS(
  order,
  orderNo,
  type,
  order_takeaway,
  order_typeId
) {
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

  let sqlGetTypeOrder = await knex
    .connect("reference")
    .select("referenceName", "referenceValue")
    .where("referenceValue", order_typeId)
    .andWhere("referenceRefCode", 9);

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
            menuOrderTypeOrderRefCode: sqlGetTypeOrder[0].referenceValue,
            menuOrderTypeOrderRefName: sqlGetTypeOrder[0].referenceName,
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
          menuOrderTypeOrderRefCode: sqlGetTypeOrder[0].referenceValue,
          menuOrderTypeOrderRefName: sqlGetTypeOrder[0].referenceName,
          fkOrderId: sqlGetOrderId[0].orderId,
          fkMenuId: orderNotExist[i].menu_id,
        });
      }
    }

    if (order_takeaway.length > 0) {
      let orderExist_takeaway = order_takeaway.filter((item) => {
        return sqlGetMenuOrder.some((item2) => {
          return item2.menu_id === item.menu_id;
        });
      });

      let orderNotExist_takeaway = order_takeaway.filter((item) => {
        return !sqlGetMenuOrder.some((item2) => {
          return item2.menu_id === item.menu_id;
        });
      });

      let menuOrderExistCancel_takeaway = sqlGetMenuOrder.filter((item) => {
        return !orderExist.some((item2) => {
          return item2.menu_id === item.menu_id;
        });
      });

      try {
        if (menuOrderExistCancel_takeaway.length > 0) {
          for (let i = 0; i < menuOrderExistCancel_takeaway.length; i++) {
            sqlCancel = await knex
              .connect("menu_order")
              .update({
                menuOrderStatusCode: 4,
                menuOrderStatusRefName: "Cancelled",
              })
              .where(
                "menuOrderId",
                menuOrderExistCancel_takeaway[i].menuOrderId
              );
          }
        }

        if (orderExist_takeaway.length > 0) {
          for (let i = 0; i < orderExist.length; i++) {
            sql = await knex
              .connect("menu_order")
              .update({
                menuOrderQuantity: orderExist_takeaway[i].menu_quantity,
                menuOrderStatusCode: sqlGetStatusOrder[0].referenceValue,
                menuOrderStatusRefName: sqlGetStatusOrder[0].referenceName,
                menuOrderPrice: orderExist_takeaway[i].menu_price,
                menuOrderDetail: JSON.stringify(orderExist_takeaway[i]),
                menuOrderTypeOrderRefCode: 2,
                menuOrderTypeOrderRefName: "Take Away",
              })
              .where("fkOrderId", sqlGetOrderId[0].orderId)
              .andWhere("fkMenuId", orderExist_takeaway[i].menu_id);
          }
        }

        if (orderNotExist_takeaway.length > 0) {
          for (let i = 0; i < orderNotExist_takeaway.length; i++) {
            sqlNotExist = await knex.connect("menu_order").insert({
              menuOrderQuantity: orderNotExist_takeaway[i].menu_quantity,
              menuOrderStatusCode: sqlGetStatusOrder[0].referenceValue,
              menuOrderStatusRefName: sqlGetStatusOrder[0].referenceName,
              menuOrderPrice: orderNotExist_takeaway[i].menu_price,
              menuOrderDetail: JSON.stringify(orderNotExist_takeaway[i]),
              menuOrderTypeOrderRefCode: 2,
              menuOrderTypeOrderRefName: "Take Away",
              fkOrderId: sqlGetOrderId[0].orderId,
              fkMenuId: orderNotExist_takeaway[i].menu_id,
            });
          }
        }
      } catch (error) {
        console.log(error);
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
      "orderServiceCharge as serviceCharge",
      "orderCustomerName as customerName",
      "orderCustomerPhoneNo as customerPhoneNo",
      "orderTableNo as tableNo",
    )
    .where(`orderNo`, order_no);

  return result[0];
}

async function getPreviousOrder(orderID) {
  let result = null;
  let sql = null;

  result = await knex
    .connect("order")
    .select(
      "orderTotalAmount as order_total",
      "orderDetail as order_detail",
    )
    .where("orderNo", orderID);

  return result;
}

async function cancelOrderPOS(order_no) {
  let result = null;
  let sql = null;

  try {
    sql = await knex
      .connect("order")
      .update({
        orderStatusCode: 4,
      })
      .where("orderNo", order_no);

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

async function cancelMenuOrderPOS(order_no) {
  let result = null;
  let sql = null;

  let sqlGetStatusOrder = await knex
  .connect("reference")
  .select("referenceName", "referenceValue")
  .where("referenceValue", 4)
  .andWhere("referenceRefCode", 4);

  let sqlGetOrderId = await knex
    .connect("order")
    .select("orderId")
    .where("orderNo", order_no);

  try {
    sql = await knex
      .connect("menu_order")
      .update({
        menuOrderStatusCode: sqlGetStatusOrder[0].referenceValue,
        menuOrderStatusRefName: sqlGetStatusOrder[0].referenceName,
      })
      .where("fkOrderId", sqlGetOrderId[0].orderId);

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

async function getOrderDetailsPOS(order_no) {
  let result = null;
  let sql = null;

  try {
    sql = await knex
      .connect("order")
      .join("menu_order", "order.orderId", "menu_order.fkOrderId")
      .select(
        "orderNo as order_no",
        "orderStatusCode as order_status",
        "orderTableNo as order_tableNo",
        "menuOrderDetail as menu_order_detail",
        "menuOrderTypeOrderRefCode as order_typeId",
        "menuOrderTypeOrderRefName as order_typeName",
      )
      .where("orderNo", order_no);

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
  cancelOrderPOS,
  cancelMenuOrderPOS,
  getPreviousOrder,
  getOrderDetailsPOS
};
