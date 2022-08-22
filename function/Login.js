const knex = require("../connection.js");

async function loginStaff(noStaff, pincodeStaff) {
  let result = null;

  result = await knex
    .connect("staff")
    .where("staffNo", noStaff)
    .andWhere("staffPincode", pincodeStaff)
    .first();

  console.log(result);

  return result;
}

module.exports = {
  loginStaff,
};
