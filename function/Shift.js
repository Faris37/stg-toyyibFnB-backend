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
        fkCounterId: sqlGetCounter[0].counterId,
        fkStaffId: staff_id,
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
        .andWhere("shiftEndDateTime", null);

      sqlGetDetails = await knex
        .connect("shift")
        .select(
          "shiftId as shift_id, shiftStartDateTime as shift_startDatetime, shiftOpenDenomination as shift_openDenomination, shiftStatus as shift_status"
        )
        .where("fkCounterId", sqlGetCounter[0].counterId)
        .andWhere("fkStaffId", staff_id)
        .andWhere("shiftStatus", "Open")
        .andWhere("shiftCloseDenomination", null)
        .andWhere("shiftEndDateTime", null)
        .andWhere("shiftId", sqlGetMaxId[0].maxId);
    }
    console.log("sqlGetMaxId", sqlGetMaxId);
    console.log(sqlGetDetails);
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

module.exports = {
  insertShift,
  updateShift,
  getShift,
};
