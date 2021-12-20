const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');
const dateFormat = require("dateformat");
const bitacora= async (log) => {
  await pool.query("insert into bitacora set ?",[log])
};

//ruta para abrir contratos/add 
router.get('/add', (req, res) =>{
    res.render('contratos/add',  { title: "Alta Contrato - Bruji Rifas" });
})

router.get("/list", async (req, res) => {
  const nombre = req.query.q;
  const cargos = nombre != null && nombre != "" ? await 
  pool.query("select a.id, concat(a.nombre,' - hrs: ', a.num_horas) as text from contratos as a where a.nombre like '%" + nombre + "%'") : 
  await 
  pool.query("select a.id, concat(a.nombre,' - hrs: ', a.num_horas) as text from contratos as a ");
  res.send(cargos);
});

//ruta para guardar los contratos
 router.post("/add", async (req, res) => {
    const {
      nombre,
      num_horas,
      observaciones
    } = req.body;
    const newContrato = {
      nombre,
      num_horas,
      observaciones
    };
    const id_empleado =  req.app.locals.user.id_empleado;
    const fecha_registro  = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    var accion =  "Ingreso un contrato";
    var host ="brujirifas";
    var tabla = "contratos";
    const log = {
        id_empleado,
        fecha_registro,
        accion,
        tabla,
        host
    } 
    //await pool.query("insert into contratos set ?", [newContrato]);
        await pool.query("insert into contratos set ?", [newContrato], (error, success) => {
          
          
          if (!error) {
              bitacora(log)
              req.flash('message', 'Guardado con éxito')
              res.redirect('/contratos');
          } else {
              req.flash('message', 'Ocurrió un error inesperado')
              res.redirect('/contactos');
          }
      });
  });

//ruta para listar los contratos
router.get("/", async (req, res) => {
    const contratos = await pool.query("select * from contratos");
    res.render("contratos/list", { contratos: contratos, title: "Contratos - Bruji Rifas" });
  });

  //ruta para eliminar contrato
router.get("/delete/:id", async(req, res) => {
  const id_empleado =  req.app.locals.user.id_empleado;
    const fecha_registro  = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    var accion =  "Eliminó un contrato";
    var host ="brujirifas";
    var tabla = "contratos";
    const log = {
        id_empleado,
        fecha_registro,
        accion,
        tabla,
        host
    } 
  
  const id = req.params.id;
  //await pool.query('delete from contratos where id = ?', id);
  await pool.query('delete from contratos where id = ?', id, (error, success) => {
    if (!error) {
        bitacora(log)
        req.flash('message', 'Eliminado con éxito')
        res.redirect('/contratos');
    } else {
        req.flash('message', 'Ocurrió un error inesperado')
        res.redirect('/contactos');
    }
    });
})

//ruta que recibe el id para llenar el formulario o la vista
router.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const contrato = await pool.query(
    "select * from contratos where id = ?",
    id
  );
  res.render("contratos/edit", {
    contrato: contrato[0],
    title: "Editar Contrato - Bruji Rifas",
  });
});

//ruta que recibe el id del para actualizar en la base de datos
router.post("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const { 
    nombre,
    num_horas,
    observaciones 
  } = req.body;
  const newContrato = {
    nombre,
    num_horas,
    observaciones
  };
  const id_empleado =  req.app.locals.user.id_empleado;
  const fecha_registro  = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
  var accion =  "Edito un contrato";
  var host ="brujirifas";
  var tabla = "productos";
  const log = {
      id_empleado,
      fecha_registro,
      accion,
      tabla,
      host
  }
  //await pool.query("update contratos set ? where id = ?", [newContrato, id]);
  await pool.query("update contratos set ? where id = ?", [newContrato, id], (error, success) => {
      
       
    if (!error) {
        bitacora(log)
        req.flash('message', 'Guardado con éxito')
        res.redirect('/contratos');
    } else {
        req.flash('message', 'Ocurrió un error inesperado')
        res.redirect('/contratos');
    }
});
});



module.exports = router;