const knex = require("../connection.js");
const moment = require("moment");

function getDateTime() {
  return moment().format("YYYY-MM-DD HH:mm:ss");
}

async function insertOrder(total, order) {
  let result = null;

  try {
    let sqlGetStatus = await knex
      .connect("reference")
      .select("referenceName", "referenceValue")
      .where("referenceValue", 3)
      .andWhere("referenceRefCode", 4);

    var tax = total * 0.06;
    var service = total * 0.1;
    var totalAmount = total + tax + service;

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
        menuOrderQuantity: order[i].quantity,
        menuOrderStatusCode: sqlGetStatus[0].referenceValue,
        menuOrderStatusRefName: sqlGetStatus[0].referenceName,
        menuOrderPrice: order[i].price,
        menuOrderDetail: order[i],
        fkOrderId: insertOrder,
        fkMenuId: order[i].id,
        menuOrderTypeOrderRefCode: order[i].orderType,
        menuOrderRemark: order[i].remarks,
      });
      console.log('Insert Menu Order: ',sql)
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
    .select("orderDetail", "orderAmount")
    .where(`orderID`, orderID);

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
  counter_id,
  discount
) {
  let result = null;
  let tax = amount * 0.06;
  let service = amount * 0.1;
  let totalAmount = total_amount + tax + service - discount;


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
      orderServiceCharge: service,
      fkStaffId: staff_id,
      fkCounterId: counter_id,
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
        fkMenud: order[i].menu_id,
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

module.exports = {
  insertOrder,
  insertmenuOrder,
  getOrder,
  insertOrderPOS,
  insertmenuOrderPOS,
};
