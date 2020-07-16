require("dotenv").config();

module.exports.checkBot = function checkBot(req, res, doSuccess) {
  fetchGoogleJSON(req, res)
    .then((response) => {
      if (response.success) {
        doSuccess();
      } else {
        res.json({ response });
      }
    })
    .catch((error) => res.json({ error }));
};

const fetchGoogleJSON = (req, res) => {
  const secret_key = process.env.CAPTCHA_SECRET;
  const token = req.body.token;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`;

  return fetch(url, {
    method: "post",
  }).then((response) => response.json());
};
