const express = require("express");
const router = express.Router();

router.use('/tbl/getCategory', require("./Category/getCategory.js"));
router.use('/getMenu', require("./Menu/getMenu.js"));
router.use('/insertOrder', require("./Order/insertOrder.js"));
router.use('/getOrder', require("./Order/getOrder.js"));


// * * * * * * * *  LOGIN * * * * * * * * //
router.use('/loginStaff', require("./LoginStaff/loginStaff.js"));

module.exports = router;
