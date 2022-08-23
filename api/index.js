const express = require("express");
const router = express.Router();

// * * * * * * * *  TABLE ORDER * * * * * * * * //
/* CATEGORIES */
router.use('/tbl/getCategory', require("./Category/getCategory.js"))
/* MENU */
router.use('/tbl/getMenu', require("./Menu/getMenu.js"));
/* ORDER */
router.use('/insertOrder', require("./Order/insertOrder.js"));
router.use('/getOrder', require("./Order/getOrder.js"));
router.use('/tbl/getMembership', require("./Membership/getMembership.js"));


// * * * * * * * *  LOGIN * * * * * * * * //
router.use('/loginStaff', require("./LoginStaff/loginStaff.js"));

module.exports = router;
