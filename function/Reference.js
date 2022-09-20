const knex = require("../connection.js");

async function getTypeOrder() {
  let result = null;
  result = await knex
    .connect("reference")
    .select("referenceValue as id", "referenceName as title", "referenceStatusCode as status")
    .where("referenceRefCode", 9);
  console.log(result);

  return result;
}

module.exports = {
  getTypeOrder,
};
