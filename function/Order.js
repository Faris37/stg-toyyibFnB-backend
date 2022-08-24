const knex = require("../connection.js");
const moment = require("moment");

function getDateTime() {
  return moment().format("YYYY-MM-DD HH:mm:ss");
}

async function insertOrder(total, order) {
  let result = null;

  try {
    let sql = await knex.connect("order").insert({
      orderStatusCode: "1",
      orderDatetime: getDateTime(),
      orderAmount: total,
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
      let sql = await knex.connect("menu_order").insert({
        menuOrderQuantity: order[i].quantity,
        menuOrderStatusCode: "4",
        menuOrderStatusRefName: "In Cart",
        menuOrderPrice: order[i].price,
        menuOrderDetail: order[i],
        fkOrderId: insertOrder,
        fkMenud: order[i].id,
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

async function insertOrderPOS() {
  let result = null;

  orderId = generateOrderID(4).then((res) => {
    console.log(res);
    return res;
  });

  orderId = await orderId;
  console.log(orderId);
  //   try {
  //     let sql = await knex.connect("order").insert({
  //       orderStatusCode: "1",
  //       orderDatetime: getDateTime(),
  //       orderAmount: total,
  //       orderDetail: JSON.stringify(order),
  //       fkStaffId: staffID,
  //       fkCustomerId: customerID,
  //       fkCounterId: counterID,
  //     });

  //     if (!sql || sql.length == 0) {
  //       result = false;
  //     } else {
  //       result = sql[0];
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }

  return orderId;
}

module.exports = {
  insertOrder,
  insertmenuOrder,
  getOrder,
  insertOrderPOS,
};
