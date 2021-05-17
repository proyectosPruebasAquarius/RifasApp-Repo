const express = require("express");
const router = express.Router();
const pool = require("../config/db.config");
const { check, validationResult } = require('express-validator');

const {isLoggedIn, isNotLoggedIn} = require("../config/auth");

const passport = require("passport");


router.get("/signup", isNotLoggedIn, (req, res) => {
    //res.render("auth/signup", { title: "Registro de Usuarios - Bruji Rifas", layout: 'layout_auth' });
    res.render("auth/signup", { title: "Registro de Usuarios - Bruji Rifas" });
  });

  router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
  }));
  
 
  // SINGIN
router.get('/login', isNotLoggedIn, (req, res) => {
  res.render("auth/login", { title: "Login - Bruji Rifas" });
});

router.post('/login', 
  //muestra mensajes de express-validator
  check('username').notEmpty().withMessage('Username is Required'),  
  check('password').notEmpty().withMessage('Password is Required'), 
  (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {      
    //return res.status(422).json({ errors: errors.array() });
    console.log('errors', errors);
    res.redirect('/login');
  }
  passport.authenticate('local.login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});
  
  router.get('/logout', (req, res) => {
    //cierra la sesión
    req.logOut();
    res.redirect('/login');
  });


module.exports = router;
