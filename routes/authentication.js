const express = require("express");
const router = express.Router();
const dateFormat = require("dateformat");
const pool = require("../config/db.config");

const passport = require("passport");

router.get("/signup", (req, res) => {
    //res.render("auth/signup", { title: "Registro de Usuarios - Bruji Rifas", layout: 'layout_auth' });
    res.render("auth/signup", { title: "Registro de Usuarios - Bruji Rifas" });
  });

router.post('/signup', (req, res) =>{
    passport.authenticate('local.signup', {
      successRedirect : '/',
      failureRedirect : '/signup',
      failureFlash : true
    });
});

router.get("/login", (req, res) => {
  res.render("auth/login", { title: "Login - Bruji Rifas", layout: 'layout_auth' });
});

module.exports = router;
