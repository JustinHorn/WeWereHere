module.exports.User = function User(name, time, message) {
  this.name = name;
  this.time = time;
  this.timeStr = getDateString(time);
  this.message = message;
};

module.exports.getRandomId = function getRandomId() {
  return (
    generateRandomNumber() +
    "" +
    generateRandomNumber() +
    "" +
    generateRandomNumber()
  );
};

function generateRandomNumber() {
  return Math.floor(Math.random() * 10000);
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
