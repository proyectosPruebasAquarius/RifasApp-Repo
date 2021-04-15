const express = require("express");
const router = express.Router();
const dateFormat = require("dateformat");
const pool = require("../config/db.config");


router.get("/add", (req, res) => {
  res.render("clientes/add", { title: "Agregar Cliente - Bruji Rifas" });
});

//ruta para guardar los clientes
router.post("/add", async (req, res) => {
  const {
    nombres,
    apellidos,
    fecha_nac,
    DUI,
    telefono,
    celular,
    direccion,
  } = req.body;
  var fecha_registro = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
  var id_municipio = 1;
  var fecha_modificacion = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
  const newCliente = {
    nombres,
    apellidos,
    DUI,
    telefono,
    celular,
    direccion,
    id_municipio,
    fecha_nac,
    fecha_registro,
    fecha_modificacion,
  };
  await pool.query("insert into clientes set ?", [newCliente]);
  res.send("Received");
});

//ruta para listar los clientes
router.get("/", async (req, res) => {
  const clientes = await pool.query("select * from clientes");
  res.render("clientes/list", { clientes: clientes, title: "Clientes - Bruji Rifas" });
});

module.exports = router;
