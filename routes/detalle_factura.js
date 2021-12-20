const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');

router.get('/add', (req, res) =>{
    res.render('detalle_factura/add',  { title: "Detalle Factura - Bruji Rifas" });
})



 //ruta para guardar los cargos
 router.post("/add", async (req, res) => {
    const {
     id,
     id_boleto,
     id_factura,
     numero,
     cod_boleto
    } = req.body;
    const newDetalle = {
        id,
        id_boleto,
        id_factura,
        numero,
        cod_boleto
    };
    await pool.query("insert into detalle_factura set ?", [newDetalle]);
    res.redirect("/detalle_factura");
  });

//ruta para listar los contratos
router.get("/", async (req, res) => {
    const detalle = await pool.query("select * from detalle_factura");
    res.render("detalle_factura/list", { detalle: detalle, title: "detalle_factura - Bruji Rifas" });
  });

  //ruta para eliminar contrato
router.get("/delete/:id", async(req, res) => {
    const id = req.params.id;
    await pool.query('delete from detalle_factura where id = ?', id);
    res.redirect("/detalle_factura");
  })
  

module.exports = router;