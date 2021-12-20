const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');

router.get('/add', (req, res) =>{
    res.render('ganadores/add',  { title: "Alta Ganador - Bruji Rifas" });
})
 //ruta para guardar los ganadores
 router.post("/add", async (req, res) => {
    const {
        id_cliente,
        codigo_rifa,
        fecha_entrega,
        estado,
        factura_premio
        
    } = req.body;
    const newGanador = {
        id_cliente,
        codigo_rifa,
        fecha_entrega,
        estado,
        factura_premio
    };
    await pool.query("insert into ganadores set ?", [newGanador]);
    const success = req.flash('success','¡Registro Guardado correctamente!');
    res.redirect("/ganadores");
  });

//ruta para listar los ganadores
router.get("/", async (req, res) => {
    const ganadores = await pool.query("select * from ganadores");
    res.render("productos/list", { ganadores: ganadores, title: "Ganadores - Bruji Rifas" });
  });

  //ruta para eliminar ganador
router.get("/delete/:id", async(req, res) => {
    const id = req.params.id;
    await pool.query('delete from ganadores where id = ?', id);
    const success = req.flash('success','Registro Eliminado correctamente!');
    res.redirect("/ganadores");
  })

  //ruta que recibe el id para llenar el formulario o la vista
router.get("/edit/:id", async(req, res) => {
  const id = req.params.id;
  const ganador = await pool.query('select * from ganadores where id = ?', id);
  res.render("ganadores/edit", { ganador : ganador[0], title: "Editar Ganador - Bruji Rifas" });
  
});

//ruta que recibe el id del para actualizar en la base de datos
router.post("/edit/:id", async(req, res) => {
  const id = req.params.id;  
  const {
    
    id_cliente,
        codigo_rifa,
        fecha_entrega,
        estado,
        factura_premio
  } = req.body;
  const newGanador = {
    id_cliente,
        codigo_rifa,
        fecha_entrega,
        estado,
        factura_premio
};
  await pool.query("update ganadores set ? where id = ?", [newGanador, id]);
  const success = req.flash('success','Registro Actualizado correctamente!');
  res.redirect("/ganadores");
});

module.exports = router;