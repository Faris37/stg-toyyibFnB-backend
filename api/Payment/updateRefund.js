const express = require("express"); // MUST HAVE
const router = express.Router(); // MUST HAVE
const model = require("../../function/Payment"); // INCLUDE FUNCTION FILE

router.post("/", async (req, res) => {
  let result = null;
  let param = null;

  param = req.body;
  let order_no = param.order_no;

  try {
    const updateRefund = await model.updateRefund(order_no);

    if (updateRefund != false) {
      result = {
        status: 200,
        message: "Success",
        data: updateRefund,
      };
    } else {
      result = {
        status: 500,
        message: "Failed",
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
