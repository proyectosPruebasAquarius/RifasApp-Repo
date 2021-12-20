const express = require('express');
const router = express.Router();
const dateFormat = require("dateformat");
const pool = require('../config/db.config');


// Get renderisar plantilla
router.get('/add', (req, res) =>{
    res.render('sorteos/add',  { title: "Alta Sorteo - Bruji Rifas" });
})

// Insert new row
router.post('/add', async (req, res) => {
    const {
        id,
        // Verificar si se editará, para usar id y en un select traer el codigo...
        codigo_rifa,
        boleto_ganador,
        fecha_sorteo,
        estado,
        fecha_entrega
    } = req.body;
    const newSorteo = {
        id,
        codigo_rifa,
        boleto_ganador,
        fecha_sorteo,
        estado,
        fecha_entrega
    };

    await pool.query("insert into sorteos set ?", [newSorteo]);
    const success = req.flash('success','Guardado correctamente!');
    res.redirect("/sorteos");
});

// Index
router.get('/', async (req, res) => {
    const sorteos = await pool.query('SELECT * FROM sorteos');
    res.render("sorteos/list", { sorteos: sorteos, title: "Sorteos - Bruji Rifas" });
});

// Get para renderisar vista con el item
router.get("/edit/:id", async(req, res) => {

    const id = req.params.id;
    const sorteo = await pool.query('select * from sorteos where id = ?', id);
    res.render("sorteos/edit", { sorteo : sorteo[0], title: "Editar Sorteo - Bruji Rifas" });
   
});

//ruta que recibe el id del para actualizar en la base de datos
router.post("/edit/:id", async(req, res) => {
    const id = req.params.id;  
    const {   
        codigo_rifa,
        boleto_ganador,
        fecha_sorteo,
        estado,
        fecha_entrega
    } = req.body;
    const newSorteo = {
        codigo_rifa,
        boleto_ganador,
        fecha_sorteo,
        estado,
        fecha_entrega
  };
    await pool.query("update sorteos set ? where id = ?", [newSorteo, id]);
    const success = req.flash('success','Registro Actualizado correctamente!');
    res.redirect("/sorteos");
});

// Get para eliminar sorteo
router.get("/delete/:id", async(req, res) => {
    const id = req.params.id;
    await pool.query('delete from sorteos where id = ?', id);
    const success = req.flash('success','Registro Eliminado correctamente!');
    res.redirect("/sorteos");
});

module.exports = router;