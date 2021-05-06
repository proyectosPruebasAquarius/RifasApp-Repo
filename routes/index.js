var express = require("express");
var router = express.Router();
const { isLoggedIn } = require('../config/auth');
/* GET home page. */
router.get("/", isLoggedIn, function (req, res, next) {
  res.render("index", { title: "Inicio - Bruji Rifas" });
});

module.exports = router;
