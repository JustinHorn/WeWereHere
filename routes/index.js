var express = require("express");
var router = express.Router();

const fs = require("fs");
const { throws } = require("assert");

const dataFile = require("./dataFile");

let users = dataFile.getUsers();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "We were here", users: users });
});

router.get("/data", function (req, res, next) {
  addUser(req.query);
  res.render("index", { title: "We were here", users: users });
});

function addUser(query) {
  let newUser = new dataFile.User(query.name, Date.now(), query.message);

  dataFile.addUserToFile(newUser);
  users = [newUser, ...users];
}

module.exports = router;
