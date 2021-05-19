const express = require("express");
const router = express.Router();
const dateFormat = require("dateformat");
const pool = require("../config/db.config");
const { isLoggedIn } = require('../config/auth');


router.get("/add", isLoggedIn, (req, res) => {
  res.render("clientes/add", { title: "Agregar Cliente - Bruji Rifas" });
  
});

//ruta para guardar los clientes
router.post("/add", isLoggedIn, async (req, res) => {
  const {
    nombres,
    apellidos,
    fecha_nac,
    DUI,
    telefono,
    celular,
    direccion,
    id_municipio
  } = req.body;
  var fecha_registro = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
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
  const success = req.flash('success','Guardado correctamente!');
 
  res.redirect("/clientes");
});

//ruta para listar los clientes
router.get("/", isLoggedIn, async (req, res) => {
  const clientes = await pool.query("select a.*, b.nombre as municipio from clientes as a inner join municipios as b on a.id_municipio = b.id");
  res.render("clientes/list", { clientes: clientes, title: "Clientes - Bruji Rifas" });

});

//ruta para eliminar
router.get("/delete/:id", isLoggedIn, async(req, res) => {
    const id = req.params.id;
    await pool.query('delete from clientes where id = ?', id);
    const success = req.flash('success','Eliminado correctamente!');
    res.redirect("/clientes");
  
});

//ruta que recibe el id para llenar el formulario o la vista
router.get("/edit/:id", isLoggedIn, async(req, res) => {
  const id = req.params.id;
  const cliente = await pool.query('select * from clientes where id = ?', id);
  res.render("clientes/edit", { cliente : cliente[0], title: "Editar Clientes - Bruji Rifas" });  
});

//ruta que recibe el id del para actualizar en la base de datos
router.post("/edit/:id", isLoggedIn, async(req, res) => {
  const id = req.params.id;  
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
  await pool.query("update clientes set ? where id = ?", [newCliente, id]);
  const success = req.flash('success','Guardado correctamente!');
  res.redirect("/clientes");
});

module.exports = router;