const express = require('express');
const router = express.Router();

const pool = require('../config/db.config');

router.get('/add', (req, res) =>{
    res.render('clientes/add',  { title: "Agregar Cliente - Bruji Rifas" });
})

module.exports = router;