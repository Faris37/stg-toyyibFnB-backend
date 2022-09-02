const express = require("express");
const router = express.Router();

// * * * * * * * *  TABLE ORDER * * * * * * * * //
/* CATEGORIES */
router.use('/tbl/getCategory', require("./Category/getCategory.js"))
/* MENU */
router.use('/getMenu', require("./Menu/getMenu.js"));
/* ORDER */
router.use('/tbl/insertOrder', require("./Order/insertOrder.js"));
router.use('/tbl/updateOrdertbl', require("./Order/updateOrdertbl.js"));
router.use('/tbl/getOrder', require("./Order/getOrder.js"));
router.use('/tbl/getOrderCart', require("./Order/getOrderCart.js"));
/* MEMBERSHIP */
router.use('/tbl/getMembership', require("./Membership/getMembership.js"));
/* PAYMENT */
router.use('/tbl/tblorderPayment', require("./Payment/tblorderPayment.js"));
router.use('/tbl/callbackPayment', require("./Payment/tblorderCallbackURL.js"));


// * * * * * * * *  LOGIN * * * * * * * * //
router.use('/loginStaff', require("./LoginStaff/loginStaff.js"));

// * * * * * * * *  TYPE ORDER * * * * * * * * //
router.use('/getTypeOrder', require("./Reference/getTypeOrder.js"));

// * * * * * * * *  ORDER POS * * * * * * * * //
router.use('/pos/insertOrder', require("./Order/insertOrderPOS.js"));
router.use('/pos/updateOrder', require("./Order/updateOrderPOS.js"));

// * * * * * * * *  PAYMENT ORDER POS * * * * * * * * //
router.use('/pos/paymentOrder', require("./Payment/insertPaymentPOS.js"));

module.exports = router;
