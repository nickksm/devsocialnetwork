const express = require("express");
const router = express.Router();

//router.get('/google') will show an error, don't specify the path here but on server.js in app.use()
router.get("/", (req, res) => {
  res.status(301).redirect("https://www.google.com");
  //   res.send("hello");
});

module.exports = router;
