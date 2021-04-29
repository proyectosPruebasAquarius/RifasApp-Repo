const express = require("express");
const router = express.Router();
const dateFormat = require("dateformat");
const pool = require("../config/db.config");

router.get("/signup", (req, res) => {
    res.render("auth/signup", { title: "Registro de Usuarios - Bruji Rifas", layout: 'layout_auth' });
  });

router.post('signup', (req, res) =>{
    //res.render('auth/signup', { title: "Agregar Usuarios - Bruji Rifas" });
});




module.exports = router;
