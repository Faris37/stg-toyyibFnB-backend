const knex = require("../connection.js");
const moment = require("moment");

function getDateTime() {
    return moment().format("YYYY-MM-DD HH:mm:ss");
}


async function insertOrder(
    total,
    order
) {
    let result = null;

    try {

        let sql = await knex.connect('order').insert({
            orderStatusCode: "1",
            orderDatetime: getDateTime(),
            orderAmount: total,
            orderDetail: JSON.stringify(order),
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

async function insertmenuOrder(
    order,
    insertOrder
) {
    let result = null;

    try {
        for (let i = 0; i < order.length; i++) {
            let sql = await knex.connect('menu_order').insert({
                menuOrderQuantity: order[i].quantity,
                menuOrderStatusCode: "4",
                menuOrderStatusRefName: "In Cart",
                menuOrderPrice: order[i].price,
                menuOrderDetail: order[i],
                fkOrderId: insertOrder,
                fkMenud: order[i].id,
            });
        }

        console.log("insertEjen: ", sql);

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
  
    result = await knex.connect(`order`).select('orderDetail', 'orderAmount').where(`orderID`, orderID)
  
    console.log(result);
  
    return result;
  }

module.exports = {
    insertOrder,
    insertmenuOrder,
    getOrder,
};