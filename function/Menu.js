const knex = require("../connection.js");


async function getMenu() {
    let result = null;
  
    result = await knex.connect(`menu`).select("menuCode as menu_code ", "menuName as menu_name" , "menuDescription as menu_desc" , "menuPrice as menu_price" , "menuId as menu_id" , "menuImage as menu_image", "menu_category.fkCategory as fkcat_id")
    .leftJoin('menu_category', 'menu.menuId', '=', 'menu_category.fkMenu').where(`menu.menuStatusCode`, 1)    
  
    console.log(result);
  
    return result;
  }

module.exports = {
    getMenu,
  };