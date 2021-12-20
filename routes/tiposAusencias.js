const express = require("express");
const router = express.Router();
const dateFormat = require("dateformat");
const pool = require("../config/db.config");
const { isLoggedIn } = require('../config/auth');

//ruta para listar los municipios en select2
router.get("/list", async (req, res) => {
   const nombre = req.query.q;
   const tipos = nombre != null && nombre != "" ? await 
   pool.query("select a.id, a.nombre as text from tipos_incapacidades as a where a.nombre like '%" + nombre + "%'") : 
   await 
   pool.query("select a.id, a.nombre as text from tipos_incapacidades as a");
   res.send(tipos);
});
router.get('/', async (req,res) => {
   const incapacidades =  await pool.query('select * from tipos_incapacidades');
  /* res.render("incapacidades/list", {
      incapacidades: incapacidades,
      title: 'Lista Incapacidades - Bruji Rifas'
   })*/
   res.send(incapacidades);
});

router.post('/incapacidades', async (req,res) => {
   const {
      nombre
   } = req.body;
   const newIncapacidad = {
      nombre
   };

   await pool.query('insert into tipos_incapacidades set ?', newIncapacidad, (error, success) => {
      if (!error) {
         req.flash('message', 'Guardado con éxito')
         res.redirect('/empleados/ausencias/');
      } else {
         req.flash('message', 'Ocurriò un error inesperado')
         res.redirect('/empleados/ausencias/');
      }
   });
   res.redirect('/empleados/ausencias/');
})

router.post('/incapacidades/:id', async (req,res) => {
   const id = req.params.id;  
   const {
      nombre
   } = req.body;
   const newIncapacidad = {
      nombre
   };

   await pool.query('update tipos_incapacidades set ? where id = ?', [newIncapacidad, id], (error, succes) => {
      if (!error) {
         req.flash('message', 'Actualizado con éxito')
         res.redirect('/empleados/ausencias/');
      } else {
         req.flash('message', 'Ocurriò un error inesperado')
         res.redirect('/empleados/ausencias/');
      }
   });
   res.redirect('/empleados/ausencias/');
})

// Modal assignValue
router.get('/value/:id', async (req,res) => {
   const id = req.params.id;
   const incapacidades =  await pool.query('select * from tipos_incapacidades where id = ?', id);
  /* res.render("incapacidades/list", {
      incapacidades: incapacidades,
      title: 'Lista Incapacidades - Bruji Rifas'
   })*/
   res.send(incapacidades);
});


router.get('/delete/:id', async (req,res) => {
   const id = req.params.id;
   const incapacidades =  await pool.query('delete from tipos_incapacidades where id = ?', id, (error, success) => {
      if (!error) {
         req.flash('message', 'Eliminado con éxito')
         res.redirect('/empleados/ausencias/');
      } else {
         req.flash('message', 'Ocurriò un error inesperado')
         res.redirect('/empleados/ausencias/');
      }
   });
   res.redirect('/empleados/ausencias/');
});

module.exports = router;