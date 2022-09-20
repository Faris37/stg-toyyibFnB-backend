const express = require("express"); // MUST HAVE
const router = express.Router(); // MUST HAVE
const model = require("../../function/Shift.js"); // INCLUDE FUNCTION FILE

router.post("/", async (req, res) => {
  let result = null;
  let param = null;

  param = req.body;

  counter = param.counterSecretKey;
  staff_id = param.staffId;
  type = param.type;

  try {
    const getShift = await model.getShift(counter, staff_id, type);

    if (getShift) {
      result = {
        status: 200,
        message: "Success",
        data: getShift,
      };
    } else if (getShift == false) {
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

  // RETURN
  res.status(200).json(result);
});

module.exports = router;
