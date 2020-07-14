var express = require("express");
var router = express.Router();
require("dotenv").config();

const { MongoClient } = require("mongodb");

const mongo_uri = process.env.MONGO;
const client = new MongoClient(mongo_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const fs = require("fs");
const fetch = require("isomorphic-fetch");

const { throws } = require("assert");

const dataFile = require("./dataFile");

let users = [];
const formIds = new Set();

fetchUsers(client);

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
    res.end();
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
  let newUser = new dataFile.User(query.name, Date.now(), query.message);
  insertToDataBase(newUser);
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

async function fetchUsers() {
  await client.connect();

  const db = client.db("IWasHere");
  const result = await db.collection("Entries").find({});

  result
    .forEach((element) => {
      users.push(element);
    })
    .then(() => {
      users.sort((a, b) => parseInt(b.time) - parseInt(a.time));
    });
}

async function insertToDataBase(user) {
  console.log("Connected correctly to server");
  const db = client.db("IWasHere");
  db.collection("Entries").insertOne(user, function (err, r) {
    if (err) throw err;
  });
}

module.exports = router;
