const knex = require("../connection.js");
const moment = require("moment");

async function getMembership(mmberID) {
  let result = null;

  result = await knex.connect(`membership`).where(`membershipNo`, mmberID);

  console.log("result", result);

  if (result.length > 0) {
    return result;
  } else {
    return false;
  }
}

async function getMembershipPOS(membership_no) {
  let result = null;

  result = await knex
    .connect(`membership`)
    .join('user', 'membership.fkUserId', '=', 'user.userId')
    .select("userFullName as name", "membershipNo as membership_no", "membershipPoints as point", "membershipStatus as status" , "membershipExpiryDate as expiry_date", "membershipDateCreated as join_date")
    .where(`membershipNo`, membership_no);

  console.log("result", result);

  if (result.length > 0) {
    return result[0];
  } else {
    return false;
  }
}

module.exports = {
  getMembership,
  getMembershipPOS
};
