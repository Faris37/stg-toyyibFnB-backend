const express = require("express"); // MUST HAVE
const router = express.Router(); // MUST HAVE
const model = require("../../function/Login"); // INCLUDE FUNCTION FILE

router.post("/", async (req, res) => {
  //   let result = null;
  let noStaff = null;
  let pincodeStaff = null;
  let result = null;

  try {
    // BIND PARAMETER TO VARIABLES
    param = req.body;

    noStaff = param.noStaff;
    pincodeStaff = param.pincodeStaff;
    getStaff = await model.loginStaff(noStaff, pincodeStaff);
    console.log("get staff",getStaff);

    if (getStaff) {
      result = {
        status: 200,
        message: "Successfull Login",
        data: getStaff,
      };
    } else {
      result = {
        status: 401,
        message: "Unsuccessful Login",
      };
    }
  } catch (error) {
    console.log(error); // LOG ERROR
    result = {
      status: 500,
      message: `API Error`,
    };
  }
  res.status(result.status).json(result);
});

module.exports = router;
