const knex = require("../connection.js");
const moment = require("moment");

function getDateTime() {
  return moment().format("YYYY-MM-DD HH:mm:ss");
}

async function insertShift(counter, cash_open, staff_id) {
  let result = null;
  let sql = null;
  let sqlgetDetails = null;
  let sqlGetCounter = await knex
    .connect("counter")
    .select("counterId")
    .where("counterSecretKey", counter);

  let totalAmountCash = 0;

  let total5cents = 0;
  let total10cents = 0;
  let total20cents = 0;
  let total50cents = 0;
  let total1RM = 0;
  let total5RM = 0;
  let total10RM = 0;
  let total20RM = 0;
  let total50RM = 0;
  let total100RM = 0;

  let cashParsed = JSON.parse(cash_open);

  total5cents = cashParsed.val5cents * 0.05;
  total10cents = cashParsed.val10cents * 0.1;
  total20cents = cashParsed.val20cents * 0.2;
  total50cents = cashParsed.val50cents * 0.5;
  total1RM = cashParsed.val1RM * 1;
  total5RM = cashParsed.val5RM * 5;
  total10RM = cashParsed.val10RM * 10;
  total20RM = cashParsed.val20RM * 20;
  total50RM = cashParsed.val50RM * 50;
  total100RM = cashParsed.val100RM * 100;

  // console.log('cashParsed',cashParsed);

  totalAmountCash =
    total5cents +
    total10cents +
    total20cents +
    total50cents +
    total1RM +
    total5RM +
    total10RM +
    total20RM +
    total50RM +
    total100RM;

  try {
    if (sqlGetCounter.length > 0) {
      sql = await knex.connect("shift").insert({
        //   shiftId: 1,
        //   shiftName: "Shift 1",
        shiftStartDateTime: getDateTime(),
        shiftOpenDenomination: cash_open,
        shiftOpenTotalAmount: totalAmountCash,
        //   shiftEndTime: getDateTime(),
        shiftStatus: "Open",
        fkCounterId: sqlGetCounter[0].counterId,
        fkStaffId: staff_id,
      });

      sqlGetDetails = await knex
        .connect("shift")
        .select(
          "shiftId as shift_id",
          "shiftStartDateTime as shift_startDatetime",
          "shiftOpenDenomination as shift_openDenomination",
          "shiftOpenTotalAmount as shift_totalAmount",
          "shiftStatus as shift_status"
        )
        .where("shiftId", sql[0]);

      console.log("sql", sql);
    }
    if (!sql || sql.length == 0 || sqlGetCounter.length == 0) {
      result = false;
    } else {
      result = sqlGetDetails;
    }
  } catch (error) {
    console.log(error);
    // result = error;
    result = false;
  }

  return result;
}

async function updateShift(shift_id, cash_open, type) {
  let result = null;
  let sql = null;
  let sqlGetDetails = null;
  let sqlGetNetSales = null;
  let sqlRefund = null;

  let totalAmountCash = 0;

  let total5cents = 0;
  let total10cents = 0;
  let total20cents = 0;
  let total50cents = 0;
  let total1RM = 0;
  let total5RM = 0;
  let total10RM = 0;
  let total20RM = 0;
  let total50RM = 0;
  let total100RM = 0;

  let cash_close = cash_open;

  if (type == "open") {
    let cashParsed = JSON.parse(cash_open);

    total5cents = cashParsed.val5cents * 0.05;
    total10cents = cashParsed.val10cents * 0.1;
    total20cents = cashParsed.val20cents * 0.2;
    total50cents = cashParsed.val50cents * 0.5;
    total1RM = cashParsed.val1RM * 1;
    total5RM = cashParsed.val5RM * 5;
    total10RM = cashParsed.val10RM * 10;
    total20RM = cashParsed.val20RM * 20;
    total50RM = cashParsed.val50RM * 50;
    total100RM = cashParsed.val100RM * 100;

    // console.log('cashParsed',cashParsed);

    totalAmountCash =
      total5cents +
      total10cents +
      total20cents +
      total50cents +
      total1RM +
      total5RM +
      total10RM +
      total20RM +
      total50RM +
      total100RM;
  } else {
    let cashParsed = JSON.parse(cash_close);

    total5cents = cashParsed.closedVal5cents * 0.05;
    total10cents = cashParsed.closedVal10cents * 0.1;
    total20cents = cashParsed.closedVal20cents * 0.2;
    total50cents = cashParsed.closedVal50cents * 0.5;
    total1RM = cashParsed.closedVal1RM * 1;
    total5RM = cashParsed.closedVal5RM * 5;
    total10RM = cashParsed.closedVal10RM * 10;
    total20RM = cashParsed.closedVal20RM * 20;
    total50RM = cashParsed.closedVal50RM * 50;
    total100RM = cashParsed.closedVal100RM * 100;

    // console.log('cashParsed',cashParsed);

    totalAmountCash =
      total5cents +
      total10cents +
      total20cents +
      total50cents +
      total1RM +
      total5RM +
      total10RM +
      total20RM +
      total50RM +
      total100RM;
  }

  try {
    if (type == "open") {
      sql = await knex
        .connect("shift")
        .update({
          shiftOpenDenomination: cash_open,
          shiftOpenTotalAmount: totalAmountCash,
        })
        .where("shiftId", shift_id);
    } else {
      let getStartDate = await knex
        .connect("shift")
        .select(
          "shiftStartDatetime as shift_startDatetime",
          "shiftOpenTotalAmount as shift_openTotalAmount"
        )
        .where("shiftId", shift_id);

      sqlGetNetSales = await knex
        .connect("transaction")
        .sum("transactionAmountNett as nettAmount")
        .sum("transactionServiceCharge as serviceCharge")
        .sum("transactionDiscount as discount")
        .sum("transactionTax as tax")
        .whereBetween("transactionDatetime", [
          getStartDate[0].shift_startDatetime,
          getDateTime(),
        ])
        .andWhere("transactionStatusCode", 1)
        .andWhere("transactionMethodCode", 1);

      sqlRefund = await knex
        .connect("transaction")
        .sum("transactionAmountNett as amountRefund")
        .whereBetween("transactionDatetime", [
          getStartDate[0].shift_startDatetime,
          getDateTime(),
        ])
        .andWhere("transactionStatusCode", 5)
        .andWhere("transactionMethodCode", 1);

      let deposit = totalAmountCash - getStartDate[0].shift_openTotalAmount;
      sql = await knex
        .connect("shift")
        .update({
          shiftCloseDenomination: cash_close,
          shiftEndDateTime: getDateTime(),
          shiftCloseTotalAmount: totalAmountCash,
          shiftStatus: "Close",
          shiftGrossSales:
            sqlGetNetSales[0].nettAmount +
            sqlRefund[0].amountRefund +
            sqlGetNetSales[0].discount -
            sqlGetNetSales[0].tax,
          shiftRefunds: sqlRefund[0].amountRefund ? sqlRefund[0].amountRefund : 0,
          shiftDiscount: sqlGetNetSales[0].discount ? sqlGetNetSales[0].discount : 0,
          shiftNetSales: sqlGetNetSales[0].nettAmount ? sqlGetNetSales[0].nettAmount : 0,
          shiftDeposit: deposit ? deposit : 0,
          shiftTax: sqlGetNetSales[0].tax ? sqlGetNetSales[0].tax : 0,
          shiftTotal: sqlGetNetSales[0].nettAmount + deposit,
        })
        .where("shiftId", shift_id);
    }

    sqlGetDetails = await knex
      .connect("shift")
      .select(
        "shiftId as shift_id",
        "shiftStartDateTime as shift_startDatetime",
        "shiftEndDateTime as shift_endDatetime",
        "shiftOpenDenomination as shift_openDenomination",
        "shiftCloseDenomination as shift_closeDenomination",
        "shiftOpenTotalAmount as shift_totalAmount",
        "shiftCloseTotalAmount as shift_closeTotalAmount",
        "shiftStatus as shift_status",
        "shiftGrossSales as shift_grossSales",
        "shiftRefunds as shift_refunds",
        "shiftDiscount as shift_discount",
        "shiftNetSales as shift_netSales",
        "shiftDeposit as shift_deposit",
        "shiftTax as shift_tax",
        "shiftTotal as shift_total"
      )
      .where("shiftId", shift_id);

    // console.log("sql", sql);
    if (!sql) {
      result = false;
    } else {
      result = sqlGetDetails;
    }
  } catch (error) {
    console.log(error);
    // result = error;
    result = false;
  }

  return result;
}

async function getShift(counter, staff_id, type) {
  let sqlGetDetails = null;
  let sqlGetMaxId = null;
  let sqlGetCounter = await knex
    .connect("counter")
    .select("counterId")
    .where("counterSecretKey", counter);

  try {
    if (type == "open") {
      sqlGetMaxId = await knex
        .connect("shift")
        .max("shiftId as maxId")
        .where("fkCounterId", sqlGetCounter[0].counterId)
        .andWhere("fkStaffId", staff_id)
        .andWhere("shiftStatus", "Open")
        .andWhere("shiftCloseDenomination", null)
        .andWhere("shiftEndDatetime", null);

      sqlGetDetails = await knex
        .connect("shift")
        .select(
          "shiftId as shift_id",
          "shiftStartDateTime as shift_startDatetime",
          "shiftOpenDenomination as shift_openDenomination",
          "shiftOpenTotalAmount as shift_totalAmount",
          "shiftStatus as shift_status"
        )
        .where("fkCounterId", sqlGetCounter[0].counterId)
        .andWhere("fkStaffId", staff_id)
        .andWhere("shiftStatus", "Open")
        .andWhere("shiftCloseDenomination", null)
        .andWhere("shiftEndDatetime", null)
        .andWhere("shiftId", sqlGetMaxId[0].maxId);
    }
    if (
      !sqlGetDetails ||
      sqlGetDetails.length == 0 ||
      sqlGetCounter.length == 0
    ) {
      result = false;
    } else {
      result = sqlGetDetails[0];
    }
  } catch (error) {
    console.log(error);
  }

  return result;
}

async function getNetSales(start, end) {
  let sql = null;
  let result = null;
  // start = "2022-09-12T21:31:10.000Z";
  // end = "2022-09-14T21:43:17.000Z";

  let startDate = moment(start).format("YYYY-MM-DD HH:mm:ss");
  let endDate = moment(end).format("YYYY-MM-DD HH:mm:ss");

  try {
    // knex.raw("SUM(transactionAmountNett) as netAmount"),
    // knex.raw("SUM(transactionServiceCharge) as serviceCharge"),
    // knex.raw("SUM(transactionDiscount) as discount"),
    // knex.raw("SUM(transactionTax) as tax"),
    sql = await knex
      .connect("transaction")
      .sum("transactionAmountNett as nettAmount")
      .sum("transactionServiceCharge as serviceCharge")
      .sum("transactionDiscount as discount")
      .sum("transactionTax as tax")
      .whereBetween("transactionDatetime", [startDate, endDate])
      .andWhere("transactionStatusCode", 1)
      .andWhere("transactionMethodCode", 1);

    console.log("sql", sql[0]);
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

async function getRefund(start, end) {
  let sql = null;
  let result = null;
  // start = "2022-09-12T21:31:10.000Z";
  // end = "2022-09-14T21:43:17.000Z";

  let startDate = moment(start).format("YYYY-MM-DD HH:mm:ss");
  let endDate = moment(end).format("YYYY-MM-DD HH:mm:ss");

  console.log("startDate", startDate);
  console.log("endDate", endDate);
  try {
    // knex.raw("SUM(transactionAmountNett) as netAmount"),
    // knex.raw("SUM(transactionServiceCharge) as serviceCharge"),
    // knex.raw("SUM(transactionDiscount) as discount"),
    // knex.raw("SUM(transactionTax) as tax"),
    sql = await knex
      .connect("transaction")
      .sum("transactionAmountNett as amountRefund")
      .whereBetween("transactionDatetime", [startDate, endDate])
      .andWhere("transactionStatusCode", 5)
      .andWhere("transactionMethodCode", 1);

    console.log("sqlrefund", sql);
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
  insertShift,
  updateShift,
  getShift,
  getNetSales,
  getRefund,
};
