var express = require("express");
var router = express.Router();
require("dotenv").config();

const fs = require("fs");
const fetch = require("isomorphic-fetch");

const { throws } = require("assert");

const dataFile = require("./dataFile");

let users = dataFile.getUsers();
const formIds = new Set();

/*TODO: use process.env for this!*/

router.get("/", function (req, res, next) {
  const id = getRandomId();
  formIds.add(id);
  res.render("index", {
    title: "We were here",
    formId: id,
    users: users,
    googleReCaptcha: process.env.CAPTCHA_PUBLIC,
  });
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

router.post("/test", function (req, res, next) {
  handleSend(req, res);
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

const handleSend = (req, res) => {
  const secret_key = process.env.CAPTCHA_SECRET;
  const token = req.body.token;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`;

  fetch(url, {
    method: "post",
  })
    .then((response) => response.json())
    .then((google_response) => res.json({ google_response }))
    .catch((error) => res.json({ error }));
};

module.exports = router;
