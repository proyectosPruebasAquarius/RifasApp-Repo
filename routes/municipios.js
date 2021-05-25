const express = require("express");
const router = express.Router();
const dateFormat = require("dateformat");
const pool = require("../config/db.config");
const { isLoggedIn } = require('../config/auth');

//ruta para listar los municipios en select2
router.get("/list", async (req, res) => {
   const nombre = req.query.q;
   const municipios = await 
   pool.query("select a.id, concat(a.nombre,' - ', b.nombre) as text from municipios as a inner join departamentos as b on a.id_departamento = b.id where a.nombre like '%" + nombre + "%'");
   res.send(municipios);
});
module.exports = router;