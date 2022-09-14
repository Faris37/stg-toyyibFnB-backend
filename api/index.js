const express = require("express");
const router = express.Router();

/* ADMIN */
router.use("/admin/login", require("./Admin/login.js"));
router.use("/admin/dashboard", require("./Admin/dashboard.js"));
router.use("/admin/getUser", require("./Admin/getUser.js"));
router.use("/admin/insertUser", require("./Admin/insertUser.js"));


// * * * * * * * *  TABLE ORDER * * * * * * * * //
/* CATEGORIES */
router.use("/tbl/getCategory", require("./Category/getCategory.js"));
/* MENU */
router.use("/getMenu", require("./Menu/getMenu.js"));
/* ORDER */

router.use('/tbl/insertOrder', require("./Order/insertOrder.js"));
router.use('/tbl/updateOrdertbl', require("./Order/updateOrdertbl.js"));
router.use('/tbl/getOrder', require("./Order/getOrder.js"));
router.use('/tbl/getOrderCart', require("./Order/getOrderCart.js"));
router.use('/tbl/getOrderConfirm', require("./Order/getOrderConfirm.js"));
router.use('/tbl/getPreviousOrder', require("./Order/getPreviousOrder.js"));

router.use("/tbl/insertOrder", require("./Order/insertOrder.js"));
router.use("/tbl/updateOrdertbl", require("./Order/updateOrdertbl.js"));
router.use("/tbl/getOrder", require("./Order/getOrder.js"));
router.use("/tbl/getOrderCart", require("./Order/getOrderCart.js"));

/* MEMBERSHIP */
router.use("/tbl/getMembership", require("./Membership/getMembership.js"));
/* PAYMENT */

router.use('/tbl/tblorderPayment', require("./Payment/tblorderPayment.js"));
router.use('/tbl/callbackPayment', require("./Payment/tblorderCallbackURL.js"));
router.use('/tbl/tblOrderPOS', require("./Payment/tblorderPaymentPOS.js"));


router.use("/tbl/tblorderPayment", require("./Payment/tblorderPayment.js"));
router.use("/tbl/callbackPayment", require("./Payment/tblorderCallbackURL.js"));


// * * * * * * * *  LOGIN * * * * * * * * //
router.use("/loginStaff", require("./LoginStaff/loginStaff.js"));

// * * * * * * * *  TYPE ORDER * * * * * * * * //
router.use("/getTypeOrder", require("./Reference/getTypeOrder.js"));

// * * * * * * * *  ORDER POS * * * * * * * * //
router.use("/pos/insertOrder", require("./Order/insertOrderPOS.js"));
router.use("/pos/updateOrder", require("./Order/updateOrderPOS.js"));
router.use("/pos/getOrderList", require("./Order/getOrderPOS.js"));
router.use("/pos/getOrderPending", require("./Order/getOrderPending.js"));
router.use("/pos/getOrderCartPOS", require("./Order/getOrderCartPOS.js"));

// * * * * * * * *  PAYMENT ORDER POS * * * * * * * * //
router.use("/pos/paymentOrder", require("./Payment/insertPaymentPOS.js"));

// * * * * * * * *  SHIFT  * * * * * * * * //
router.use("/pos/insertShift", require("./Shift/insertShift.js"));
router.use("/pos/getShift", require("./Shift/getShift.js"));
router.use("/pos/updateShift", require("./Shift/updateShift.js"));



module.exports = router;
