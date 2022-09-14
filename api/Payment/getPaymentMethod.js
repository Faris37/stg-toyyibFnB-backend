const express = require("express"); // MUST HAVE
const router = express.Router(); // MUST HAVE
const model = require("../../function/Payment"); // INCLUDE FUNCTION FILE

router.get("/", async (req, res) => {
  let result = null;

  try {
    const getPaymentMethod = await model.getPaymentMethod();

    if (getPaymentMethod) {
      result = {
        status: 200,
        message: "Success",
        data: getPaymentMethod,
      };
    } else if (getPaymentMethod == false) {
      result = {
        status: 200,
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

  // RETURN
  res.status(result.status).json(result);
});

module.exports = router;
