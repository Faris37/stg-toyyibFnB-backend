const express = require("express"); // MUST HAVE
const router = express.Router(); // MUST HAVE
const model = require("../../function/Category.js"); // INCLUDE FUNCTION FILE

// MAKE SURE METHOD IS CORRECT WHEN CALLING API

// GET USER
router.get("/", async (req, res) => {
  
  let result = null;

  try {

    // GET USER FUNCTION
    const getCategory = await model.getCategory();

    if (!getCategory) return;

    result = {
      response:200,
      message: "Successfull List of Category",
      environment: process.env.ENVIRONMENT,
      data: getCategory,
    };
  } catch (error) {
    console.log(error); // LOG ERROR
    result = {
      message: `API Error`,
    };
  }

  // RETURN
  res.status(200).json(result);
});

module.exports = router;