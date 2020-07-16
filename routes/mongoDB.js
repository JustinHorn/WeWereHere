module.exports.fetchUsers = async function fetchUsers(client, users) {
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
};

module.exports.insertToDataBase = async function insertToDataBase(
  client,
  user
) {
  console.log("Connected correctly to server");
  const db = client.db("IWasHere");
  db.collection("Entries").insertOne(user, function (err, r) {
    if (err) throw err;
  });
};
