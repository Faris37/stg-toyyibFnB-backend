const knex = require("../connection.js");
const moment = require("moment");

async function getMembership(
    mmberID
) {
    let result = null;

    result = await knex.connect(`membership`).where(`membershipNo`, mmberID)

    console.log(result);

    return result;
}

module.exports = {
    getMembership
};