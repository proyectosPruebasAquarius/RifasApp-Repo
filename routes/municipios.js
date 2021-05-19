const express = require("express");
const router = express.Router();
const dateFormat = require("dateformat");
const pool = require("../config/db.config");
const { isLoggedIn } = require('../config/auth');

//ruta para listar los municipios
router.get("/list", async (req, res) => {
    const nombre = req.query.q;
    const municipios = await pool.query("select id, nombre as text from municipios where nombre like '%" + nombre + "%'");
    res.send(municipios);
  });

  module.exports = router;