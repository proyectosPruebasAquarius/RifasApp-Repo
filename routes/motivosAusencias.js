const express = require("express");
const router = express.Router();
const dateFormat = require("dateformat");
const pool = require("../config/db.config");
const { isLoggedIn } = require('../config/auth');

//ruta para listar los municipios en select2
router.get("/list", async (req, res) => {
   const nombre = req.query.q;
   const tipos = nombre != null && nombre != "" ? await 
   pool.query("select a.id, a.nombre as text from motivos_ausencias as a where a.nombre like '%" + nombre + "%'") : 
   await 
   pool.query("select a.id, a.nombre as text from motivos_ausencias as a");
   res.send(tipos);
});

router.get('/', async (req,res) => {
   const motivos =  await pool.query('select * from motivos_ausencias');
   res.send(motivos);
});

router.post('/otros', async (req,res) => {
   const {
      nombre
   } = req.body;
   const newMotivo = {
      nombre
   };

   await pool.query('insert into motivos_ausencias set ?', newMotivo, (error, success) => {
      if (!error) {
         req.flash('message', 'Guardado con éxito')
         res.redirect('/empleados/ausencias/');
      } else {
         req.flash('message', 'Ocurriò un error inesperado')
         res.redirect('/empleados/ausencias/');
      }
   });
   //res.redirect('/empleados/ausencias/');
})

router.post('/otros/:id', async (req,res) => {
   const id = req.params.id;  
   const {
      nombre
   } = req.body;
   const newIncapacidad = {
      nombre
   };

   await pool.query('update motivos_ausencias set ? where id = ?', [newIncapacidad, id], (error, success) => {
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
   const motivos =  await pool.query('select * from motivos_ausencias where id = ?', id);
  /* res.render("incapacidades/list", {
      incapacidades: incapacidades,
      title: 'Lista Incapacidades - Bruji Rifas'
   })*/
   res.send(motivos);
});

router.get('/delete/:id', async (req,res) => {
   const id = req.params.id;
   await pool.query('delete from motivos_ausencias where id = ?', id, (error, success) => {
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