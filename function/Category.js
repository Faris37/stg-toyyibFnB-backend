const knex = require("../connection.js");


async function getCategory() {
    let result = null;
  
    result = await knex.connect(`category`).where(`categoryStatusCode`, 1)
  
    console.log(result);
  
    return result;
  }

module.exports = {
    getCategory,
  };