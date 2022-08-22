const express = require("express"); // MUST HAVE
const router = express.Router(); // MUST HAVE
const model = require("../../function/Menu.js"); // INCLUDE FUNCTION FILE

// MAKE SURE METHOD IS CORRECT WHEN CALLING API

// GET USER
router.get("/", async (req, res) => {
  
  let result = null;

  try {

    // GET USER FUNCTION
    const getMenu = await model.getMenu();

    if (!getMenu) return;

    result = {
      message: "Successfull List of Menu",
      environment: process.env.ENVIRONMENT,
      data: getMenu,
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