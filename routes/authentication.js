const express = require("express");
const router = express.Router();
const pool = require("../config/db.config");

const passport = require("passport");

router.get("/signup", (req, res) => {
    //res.render("auth/signup", { title: "Registro de Usuarios - Bruji Rifas", layout: 'layout_auth' });
    res.render("auth/signup", { title: "Registro de Usuarios - Bruji Rifas" });
  });

  router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
  }));
  
  // SINGIN
  router.get('/login', (req, res) => {
    res.render("auth/login", { title: "Login - Bruji Rifas", layout: 'layout_auth' });
  });

  router.post('/login', (req, res, next) => {
    req.check('username', 'Username is Required').notEmpty();
    req.check('password', 'Password is Required').notEmpty();
    const errors = req.validationErrors();
    if (errors.length > 0) {
      req.flash('message', errors[0].msg);
      res.redirect('/login');
    }
    passport.authenticate('local.login', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    })(req, res, next);
  });
  
  router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
  });


module.exports = router;
