var express = require("express");
var router = express.Router();
require("dotenv").config();

const fetch = require("isomorphic-fetch");

const { User, getRandomId } = require("./helper/User");
const { fetchUsers, insertToDataBase } = require("./helper/mongoDB");

const { checkBot } = require("./helper/google");

let users = [];
const formIds = new Set();

const { MongoClient } = require("mongodb");

const mongo_uri = process.env.MONGO;
const client = new MongoClient(mongo_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

fetchUsers(client, users);

router.get("/", function (req, res, next) {
  sendIndex(res);
});

router.post("/data", function (req, res, next) {
  if (isRequestValid(req)) {
    formIds.delete(req.body.formId);
    checkBot(req, res, () => {
      addUser(req.body);
      sendIndex(res);
    });
  } else {
    sendIndex(res);
  }
});

router.get("/data", function (req, res, next) {
  sendIndex(res);
});

function isRequestValid(req) {
  return formIds.has(req.body.formId);
}

function addUser(query) {
  let newUser = new User(query.name, Date.now(), query.message);
  insertToDataBase(client, newUser);
  users = [newUser, ...users];
}

function sendIndex(res) {
  const id = getRandomId();
  formIds.add(id);
  res.render("index", {
    title: "We were here",
    formId: id,
    users: users,
    googleReCaptcha: process.env.CAPTCHA_PUBLIC,
  });
}

module.exports = router;
