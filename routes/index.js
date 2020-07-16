var express = require("express");
var router = express.Router();
require("dotenv").config();

const fetch = require("isomorphic-fetch");

const { User, getRandomId } = require("./User");
const { fetchUsers, insertToDataBase } = require("./mongoDB");

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

function isRequestValid(req) {
  return formIds.has(req.body.formId);
}

function checkBot(req, res, doSuccess) {
  fetchGoogleJSON(req, res)
    .then((response) => {
      if (response.success) {
        doSuccess();
      } else {
        res.json({ response });
      }
    })
    .catch((error) => res.json({ error }));
}

const fetchGoogleJSON = (req, res) => {
  const secret_key = process.env.CAPTCHA_SECRET;
  const token = req.body.token;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`;

  return fetch(url, {
    method: "post",
  }).then((response) => response.json());
};

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
