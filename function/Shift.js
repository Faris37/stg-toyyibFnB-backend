const knex = require("../connection.js");
const moment = require("moment");

function getDateTime() {
  return moment().format("YYYY-MM-DD HH:mm:ss");
}

async function insertShift(counter, cash_open, staff_id) {
  let result = null;
  let sql = null;
  let sqlGetCounter = await knex
    .connect("counter")
    .select("counterId")
    .where("counterSecretKey", counter);

  try {
    if (sqlGetCounter.length > 0) {
      sql = await knex.connect("shift").insert({
        //   shiftId: 1,
        //   shiftName: "Shift 1",
        shiftStartDateTime: getDateTime(),
        shiftOpenDenomination: cash_open,
        //   shiftEndTime: getDateTime(),
        shiftStatus: "Open",
        shiftCounter: sqlGetCounter[0].counterId,
        shiftStaffId: staff_id,
      });
    }
    if (!sql || sql.length == 0 || sqlGetCounter.length == 0) {
      result = false;
    } else {
      result = sql[0];
    }
  } catch (error) {
    console.log(error);
    // result = error;
    result = false;
  }

  return result;
}

async function updateShift() {}

async function getShift() {}

module.exports = {
  insertShift,
  updateShift,
  getShift,
};
