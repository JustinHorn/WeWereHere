const fs = require("fs");
const { throws } = require("assert");

function User(name, time, message) {
  this.name = name;
  this.time = time;
  this.timeStr = getDateString(time);
  this.message = message;
}

function getDateString(timeStr) {
  const time = new Date(parseInt(timeStr));
  const day = leadingZero(time.getDate());
  const month = leadingZero(time.getMonth() + 1);
  const year = time.getFullYear();
  const hour = leadingZero(time.getHours());
  const minutes = leadingZero(time.getMinutes());
  return day + "." + month + "." + year + " " + hour + ":" + minutes;
}

function leadingZero(integer) {
  return integer < 10 ? "0" + integer : integer;
}

function getUsers() {
  let users = [];

  fs.readFile("IWasHere/../public/data.txt", "utf8", function (err, data) {
    if (err) throw err;
    data = data.split(";");
    for (let i = 0; i < data.length - 3; i += 3) {
      users.push(new User(data[i], data[i + 1], data[i + 2]));
    }
    users = users.reverse();
  });
  return users;
}

function addUserToFile(user) {
  fs.appendFile(
    "IWasHere/../public/data.txt",
    user.name + ";" + user.time + ";" + user.message + ";",
    function (err) {
      if (err) throw err;
    }
  );
}

module.exports.getUsers = getUsers;

module.exports.User = User;

module.exports.addUserToFile = addUserToFile;
