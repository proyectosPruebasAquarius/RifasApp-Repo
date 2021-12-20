const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');

router.get('/add', (req, res) => {
    res.render('sucursales/add', { title: "Alta Sucursal - Bruji Rifas" });
})

//ruta para guardar las sucursales
router.post("/add", async(req, res) => {
    const {

        nombre,
        telefono,
        direccion,
        id_municipio,

    } = req.body;
    const estado = 1;
    const newSucursal = {

        nombre,
        telefono,
        direccion,
        id_municipio,
        estado
    };
    await pool.query("insert into sucursales set ?", [newSucursal], (error, success) => {
        if (!error) {
            req.flash('message', 'Guardado con éxito')
            res.redirect('/sucursales');
        } else {
            req.flash('message', 'Ocurrió un error inesperado')
            res.redirect('/sucursales');
        }
    });

});

//ruta para listar las sucursales
router.get("/", async(req, res) => {
    const sucursales = await pool.query("select a.id as id_sucursal,a.*, b.nombre as municipio, c.nombre as departamento from sucursales as a inner join municipios as b on a.id_municipio = b.id inner join departamentos as c on b.id_departamento = c.id");
    res.render("sucursales/list", { sucursales: sucursales, title: "Sucursales - Bruji Rifas", message: req.flash('message') });
});
 //ruta para listar las sucursales en select2
 router.get("/list", async (req, res) => {
    const nombre = req.query.q;
    const sucursales = nombre != null && nombre != "" ? await 
    pool.query("select id,nombre as text from sucursales where nombre like '%" + nombre + "%'") : 
    await 
    pool.query("select id, nombre as text from sucursales ");
    res.send(sucursales);
  });
//ruta para eliminar
router.get("/delete/:id", async(req, res) => {
    const cod_sucursal = req.params.id;
    await pool.query('delete from sucursales where id = ?', cod_sucursal);
    const success = req.flash('success', 'Eliminado correctamente!');
    res.redirect("/sucursales");
})

//ruta que recibe el cod_sucursal para llenar el formulario o la vista
router.get("/edit/:id", async(req, res) => {
    const cod_sucursal = req.params.id;
    const sucursal = await pool.query('select a.id,a.nombre,a.direccion,a.telefono,a.estado,b.id as id_municipio, b.nombre as municipio, c.nombre as departamento from sucursales as a inner join municipios as b on a.id_municipio = b.id inner join departamentos as c on b.id_departamento = c.id where a.id = ?', cod_sucursal);
    res.render("sucursales/edit", { sucursal: sucursal[0], title: "Editar Sucursal - Bruji Rifas" });
});

//ruta que recibe el id del para actualizar en la base de datos
router.post("/edit/:id", async(req, res) => {
    const cod_sucursal = req.params.id;
    const {

        nombre,
        telefono,
        direccion,
        id_municipio,

    } = req.body;
    const newSucursal = {
        nombre,
        telefono,
        direccion,
        id_municipio,
    };
    await pool.query("update sucursales set ? where id = ?", [newSucursal, cod_sucursal]);
    setTimeout(function() {
        res.redirect("/sucursales");
    }, 1000)

});

module.exports = router;