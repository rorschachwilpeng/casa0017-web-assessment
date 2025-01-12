const express = require("express");
const db = require("../db/index");
const router = express.Router();

/**
 * User registration route
 * @route POST /api/reguser
 */
router.post("/reguser", (req, res) => {
  try {
    // Receive form data
    const userinfo = req.body;
    // Validate data
    if (!userinfo.username || !userinfo.password) {
      return res.send({
        status: 1,
        msg: "Username and password cannot be empty",
      });
    }

    // Define SQL query to check if username is taken
    const sqlStr = "SELECT * FROM ev_users WHERE username=?";
    db.query(sqlStr, userinfo.username, (err, results) => {
      if (err) return res.send({ status: 1, message: err.message }); // SQL execution error
      // Check if username is taken
      if (results.length > 0) {
        return res.send({
          status: 1,
          message: "Username is already taken, please choose another one",
        });
      }
      // Username is available
      // TODO Others
    });
    
  } catch (error) {
    res.status(500).send("Registration failed");
  }
});

/**
 * User login route
 * @route POST /api/login
 */
router.post("/login", (req, res) => {
  try {
    console.log("Login request body:", req.body);
    // TODO: Add user login logic
    res.send("login OK");
  } catch (error) {
    res.status(500).send("Login failed");
  }
});

module.exports = router;