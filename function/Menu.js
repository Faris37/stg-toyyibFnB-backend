const knex = require("../connection.js");


async function getMenu() {
  let result = null;

  result = await knex.connect(`menu`).select("menuCode as menu_code ", "menuName as menu_name", "menuDescription as menu_desc", "menuPrice as menu_price", "menuId as menu_id", "menuImage as menu_image", "menuCategory as menu_category", "menuVariant as menu_variant", "menuRefStationOrder as menu_station")
    .where(`menu.menuStatusCode`, 1)

  console.log(result);

  return result;
}

module.exports = {
  getMenu,
};