const knex = require("../connection.js");


async function getMenu() {
    let result = null;
  
    result = await knex.connect(`menu`).where(`menuStatusCode`, 1)
  
    console.log(result);
  
    return result;
  }

module.exports = {
    getMenu,
  };