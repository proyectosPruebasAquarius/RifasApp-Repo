const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');
const { isLoggedIn,masterRutes } = require('../config/auth');
router.get('/add',isLoggedIn,masterRutes, (req, res) => {
    res.render('cargos/add', { title: "Alta Cargo - Bruji Rifas" });
})

//ruta para listar las sucursales en select2
router.get("/list",isLoggedIn,masterRutes, async(req, res) => {
    const nombre = req.query.q;
    const cargos = nombre != null && nombre != "" ? await
    pool.query("select a.id, concat(a.nombre,' - $', a.sueldo) as text from cargos as a where a.nombre like '%" + nombre + "%'"):
        await
    pool.query("select a.id, concat(a.nombre,' - $', a.sueldo) as text from cargos as a ");
    res.send(cargos);
});

//ruta para guardar los cargos
router.post("/add",isLoggedIn,masterRutes, async(req, res) => {
    const {
        nombre,
        sueldo
    } = req.body;
    const newCargo = {
        nombre,
        sueldo
    };
    await pool.query("insert into cargos set ?", [newCargo], (error, succcess) => {
        if (!error) {
            req.flash('message', 'Guardado con éxito')
            res.redirect('/cargos');
        } else {
            req.flash('message', 'Ocurrió un error inesperado')
            res.redirect('/cargos');
        }
    });

});

//ruta para listar los contratos
router.get("/",isLoggedIn,masterRutes, async(req, res) => {
    const cargos = await pool.query("select * from cargos");
    res.render("cargos/list", { cargos: cargos, title: "Cargos - Bruji Rifas", message: req.flash('message') });
});

//ruta para eliminar contrato
router.get("/delete/:id",isLoggedIn,masterRutes, async(req, res) => {
    const id = req.params.id;
    await pool.query('delete from cargos where id = ?', id);
    const success = req.flash('success', 'Eliminado correctamente!');
    res.redirect("/cargos");
})

//ruta que recibe el id para llenar el formulario o la vista
router.get("/edit/:id",isLoggedIn,masterRutes, async(req, res) => {
    const id = req.params.id;
    const cargo = await pool.query('select * from cargos where id = ?', id);
    res.render("cargos/edit", { cargo: cargo[0], title: "Editar Cargo - Bruji Rifas" });

});

//ruta que recibe el id del para actualizar en la base de datos
router.post("/edit/:id",isLoggedIn,masterRutes, async(req, res) => {
    const id = req.params.id;
    const {
        nombre,
        sueldo
    } = req.body;
    const newCargo = {
        nombre,
        sueldo
    };
    await pool.query("update cargos set ? where id = ?", [newCargo, id]);
    const success = req.flash('success', 'Actualizado correctamente!');
    res.redirect("/cargos");
});

module.exports = router;