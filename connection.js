const AWS = require("aws-sdk");
const Knex = require("knex");
const mysql = require("mysql");

let database = null;
const host = "13.250.76.154";
const user = "admin";
const password = "Xs2mysql_admin_ski";

if (process.env.ENVIRONMENT == "development") database = "dev-toyyibfnb";
if (process.env.ENVIRONMENT == "demo") database = "ski_demo";
if (process.env.ENVIRONMENT == "production") database = "ski_prod";

AWS.config.update({
  region: "ap-southeast-1",
});

const connection = {
  host,
  user,
  password,
  database,
};

// Create a connection
function execute() {
  return Knex({
    client: "mysql",
    connection,
  });
}

const connect = Knex({ client: "mysql", connection });

module.exports = { execute, connect };
