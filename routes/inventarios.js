const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');
const dateFormat = require("dateformat");

router.get('/add', (req, res) => {
        res.render('inventarios/add', { title: "Alta Inventario - Bruji Rifas" });
    })
    //ruta para guardar los inventarios
router.post("/add", async(req, res) => {
    const {

        precio_compra,
        precio_venta,
        id_proveedor,
        observaciones,
        stock,
        id_producto
    } = req.body;
    var fecha_registro = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    const newInventario = {
        fecha_registro,
        precio_compra,
        precio_venta,
        id_proveedor,
        observaciones,
        stock,
        id_producto
    };
    await pool.query("insert into inventarios set ?", [newInventario], (error, succcess) => {
        if (!error) {
            req.flash('message', 'Guardado con éxito')
            res.redirect('/inventarios');
        } else {
            req.flash('message', 'Ocurrió un error inesperado')
            res.redirect('/inventarios');
        }
    });

});

//ruta para listar los inventarios
router.get("/", async(req, res) => {
    const inventarios = await pool.query("select a.id,a.fecha_registro,a.precio_compra,a.precio_venta,a.observaciones,a.stock,b.nombre as proveedor,c.nombre as producto from inventarios as a inner join proveedores as b on a.id_proveedor=b.id inner join productos as c on a.id_producto=c.id");
    res.render("inventarios/list", { inventarios: inventarios, title: "Inventarios - Bruji Rifas", message: req.flash('message') });
});

//ruta para eliminar inventario
router.get("/delete/:id", async(req, res) => {
    const id = req.params.id;
    await pool.query('delete from inventarios where id = ?', id);
    const success = req.flash('success', 'Registro Eliminado correctamente!');
    res.redirect("/inventarios");
})

//ruta que recibe el id para llenar el formulario o la vista
router.get("/edit/:id", async(req, res) => {
    const id = req.params.id;
    const inventario = await pool.query('select b.id as id_proveedor,b.nombre as proveedor,c.id as id_producto,c.nombre as producto,a.id,a.fecha_registro,a.precio_compra,a.precio_venta,a.observaciones,a.stock,b.nombre as proveedor,c.nombre as producto from inventarios as a inner join proveedores as b on a.id_proveedor=b.id inner join productos as c on a.id_producto=c.id where a.id = ?', id);
    res.render("inventarios/edit", { inventario: inventario[0], title: "Editar Inventario - Bruji Rifas" });

});

//ruta que recibe el id del para actualizar en la base de datos
router.post("/edit/:id", async(req, res) => {
    const id = req.params.id;
    const {

        precio_compra,
        precio_venta,
        id_proveedor,
        observaciones,
        stock,
        id_producto
    } = req.body;
    const newInventario = {

        precio_compra,
        precio_venta,
        id_proveedor,
        observaciones,
        stock,
        id_producto
    };
    await pool.query("update inventarios set ? where id = ?", [newInventario, id]);
    const success = req.flash('success', 'Registro Actualizado correctamente!');
    res.redirect("/inventarios");
});

module.exports = router;