const express = require('express');
const router = express.Router();

const pool = require('../config/db.config');

router.get('/add', (req, res) =>{
    res.render('clientes/add',  { title: "Agregar Cliente - Bruji Rifas" });
})

router.post('/add', async(req, res) =>{
    const { nombres, 
        apellidos, 
        fecha_nac, 
        DUI, 
        telefono, 
        celular, 
         
        direccion } = req.body;
        var datetime = new Date();
        var fecha_registro = datetime.toISOString().slice(0,10);
        var id_municipio = 1;
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
        fecha_registro
    }
    await pool.query('insert into clientes set ?', [newCliente]);
    res.send('Received');
})

module.exports = router;