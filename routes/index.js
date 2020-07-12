var express = require("express");
var router = express.Router();

const fs = require("fs");
const { throws } = require("assert");

const dataFile = require("./dataFile");

let users = dataFile.getUsers();
const formIds = new Set();

/* GET home page. */
router.get("/", function (req, res, next) {
  const id = getRandomId();
  formIds.add(id);
  res.render("index", { title: "We were here", formId: id, users: users });
});

router.post("/data", function (req, res, next) {
  if (isRequestValid(req)) {
    formIds.delete(req.body.formId);
    addUser(req.body);
    res.render("index", { title: "We were here", formId: "", users: users });
  } else {
    res.write("Data send twice or id became invalid!");
    res.end();
  }
});

function isRequestValid(req) {
  return formIds.has(req.body.formId);
}

function addUser(query) {
  let newUser = new dataFile.User(query.name, Date.now(), query.message);

  dataFile.addUserToFile(newUser);
  users = [newUser, ...users];
}

function getRandomId() {
  return (
    generateRandomNumber() +
    "" +
    generateRandomNumber() +
    "" +
    generateRandomNumber()
  );
}

function generateRandomNumber() {
  return Math.floor(Math.random() * 10000);
}

module.exports = router;
