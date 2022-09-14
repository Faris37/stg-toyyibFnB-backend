const knex = require("../connection.js");


async function loginCredentials(username, password) {
  let result = null;
  let sql = null;

  try {
    sql = await knex
      .connect("staff")
      .select(
        "staffId as staff_id"
      )
      .where("staffEmail", username)
      .andWhere("staffPassword", password)
      .andWhere("fkPositionID", 1)
      .andWhere("staffStatusCode", 1);

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

async function getDashboardDetails(staffid) {
  let result = null;
  let sql = null;

  try {
    sql = await knex
      .connect("staff")
      .select(
        "staffName as staff_name"
      )
      .where("staffId", staffid)
      .andWhere("staffStatusCode", 1);

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

async function getUserDetails() {
  let result = null;
  let sql = null;

  try {
    sql = await knex
      .connect("user")
      .select(
        "userFullName as user_name",
        "userPhoneNo as user_phone",
        "userEmail as user_email",
      )
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

async function insertUser(fullname, phone, email, address,) {
  let result = null;
  let sql = null;

  try {
    sql = await knex.connect("user").insert({
      userFullName: fullname,
      userPhoneNo: phone,
      userEmail: email,
      userAddress: address,
    });
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
  loginCredentials,
  getDashboardDetails,
  getUserDetails,
  insertUser,
};