const express = require("express"); // MUST HAVE
const router = express.Router(); // MUST HAVE
const model = require("../../function/Order.js"); // INCLUDE FUNCTION FILE

// MAKE SURE METHOD IS CORRECT WHEN CALLING API

// GET USER
router.post("/", async (req, res) => {
  let param = null;
  let result = null;
  let order_no = null;

  try {
    param = req.body;

    order_no = param.order_no;

    // GET USER FUNCTION
    const getOrderCart = await model.getOrderCartPOS(order_no);

    if (!getOrderCart) {
      result = {
        status: 200,
        message: "No data",
      };
    } else {
      result = {
        status: 200,
        message: "Success",
        data: getOrderCart,
      };
    }
  } catch (error) {
    console.log(error); // LOG ERROR
    result = {
      status: 500,

      message: `API Error`,
    };
  }

  // RETURN
  res.status(result.status).json(result);
});

module.exports = router;
