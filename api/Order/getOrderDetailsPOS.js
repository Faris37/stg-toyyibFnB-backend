const express = require("express"); // MUST HAVE
const router = express.Router(); // MUST HAVE
const model = require("../../function/Order"); // INCLUDE FUNCTION FILE

router.post("/", async (req, res) => {
  let param = null;
  let result = null;

  let order_no = null;

  try {
    // BIND PARAMETER TO VARIABLES
    param = req.body;

    order_no = param.order_no;

    console.log("order_no", order_no);

    let getOrderDetails = await model.getOrderDetailsPOS(order_no);

    if (getOrderDetails != false) {
      result = {
        status: 200,
        message: "Success",
        data: getOrderDetails,
      };
    } else {
      result = {
        message: "No data",
      };
    }
  } catch (error) {
    console.log(error); // LOG ERROR
    result = {
      status: 500,
      message: `API Error`,
    };
  }
  res.status(200).json(result);
});

module.exports = router;
