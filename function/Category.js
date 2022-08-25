const knex = require("../connection.js");


async function getCategory() {
    let result = null;
  
    result = await knex.connect(`category`).select("categoryId as category_id ", "categoryName as category_name").where(`categoryStatusCode`, 1)
  
    console.log(result);
  
    return result;
  }

module.exports = {
    getCategory,
  };