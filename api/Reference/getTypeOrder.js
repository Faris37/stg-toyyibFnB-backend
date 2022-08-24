const express = require("express"); // MUST HAVE
const router = express.Router(); // MUST HAVE
const model = require("../../function/Reference.js"); // INCLUDE FUNCTION FILE

router.get("/", async (req, res) => {
  let result = null;

  try {
    const getTypeOrder = await model.getTypeOrder();

    if (!getTypeOrder) return;

    if (getTypeOrder) {
      result = {
        status: 200,
        message: "Success",
        data: getTypeOrder,
      };
    } else {
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