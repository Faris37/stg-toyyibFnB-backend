const knex = require("../connection.js");


async function getMenu() {
    let result = null;
  
    result = await knex.connect(`menu`).select("menuCode as menu_code ", "menuName as menu_name" , "menuDescription as menu_desc" , "menuPrice as menu_price" , "menuId as menu_id").where(`menuStatusCode`, 1)    
  
    console.log(result);
  
    return result;
  }

module.exports = {
    getMenu,
  };