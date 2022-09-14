const knex = require("../connection.js");
const moment = require("moment");

async function getMembership(mmberID) {
  let result = null;

  result = await knex.connect(`membership`).where(`membershipNo`, mmberID);

  console.log('result', result);

  if (result.length > 0) {
    return result;
  } else {
    return false;
  }
}

module.exports = {
  getMembership,
};
