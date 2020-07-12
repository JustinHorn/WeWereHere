var express = require("express");
var router = express.Router();

const fs = require("fs");

/* GET home page. */
router.get("/", function (req, res, next) {
  const user = { name: "Justin", time: "today", id: "1", message: "yo leute" };
  res.render("index", { title: "We were here", users: [user] });
});

router.get("/data", function (req, res, next) {
  console.log(req.query);
  const name = req.query.name;

  const message = req.query.message;
  fs.appendFile(
    "IWasHere/../public/data.txt",
    name + ";" + Date.now() + ";" + message + ";",
    function (err) {
      if (err) throw err;
    }
  );
  res.render("index", { title: "We were here" });
});

module.exports = router;
