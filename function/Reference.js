const knex = require("../connection.js");

async function getTypeOrder() {
  let result = null;
  result = await knex
    .connect("reference")
    .select("referenceValue as id", "referenceName as title")
    .where("referenceRefCode", 9)
    .andWhere("referenceStatusCode", 1);
  console.log(result);

  return result;
}

module.exports = {
  getTypeOrder,
};
