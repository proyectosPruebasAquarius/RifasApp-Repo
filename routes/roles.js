const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');
const { isLoggedIn,masterRutes } = require('../config/auth');
router.get('/add',isLoggedIn,masterRutes, (req, res) => {
        res.render('roles/add', { title: "Alta Rol - Bruji Rifas" });
    })
    //ruta para guardar los roles
router.post("/add",isLoggedIn,masterRutes, async(req, res) => {
    const {
        nombre
    } = req.body;
    const newRol = {
        nombre
    };
    await pool.query("insert into roles set ?", [newRol], (error, succcess) => {
        if (!error) {
            req.flash('message', 'Guardado con éxito')
            res.redirect('/roles');
        } else {
            req.flash('message', 'Ocurrió un error inesperado')
            res.redirect('/roles');
        }
    });
    /* const success = req.flash('success', '¡Registro Guardado correctamente!');*/

});

//ruta para listar los roles
router.get("/",isLoggedIn,masterRutes, async(req, res) => {
    const roles = await pool.query("select * from roles");
    res.render("roles/list", { roles: roles, title: "Roles - Bruji Rifas", message: req.flash('message') });
});

//ruta para eliminar rol
router.get("/delete/:id",isLoggedIn,masterRutes, async(req, res) => {
    const id = req.params.id;
    await pool.query('delete from roles where id = ?', id);
    const success = req.flash('success', 'Registro Eliminado correctamente!');
    res.redirect("/roles");
})

//ruta que recibe el id para llenar el formulario o la vista
router.get("/edit/:id",isLoggedIn,masterRutes, async(req, res) => {
    const id = req.params.id;
    const rol = await pool.query('select * from roles where id = ?', id);
    res.render("roles/edit", { rol: rol[0], title: "Editar Rol - Bruji Rifas" });

});

//ruta que recibe el id del para actualizar en la base de datos
router.post("/edit/:id",isLoggedIn,masterRutes, async(req, res) => {
    const id = req.params.id;
    const {
        nombre
    } = req.body;
    const newRol = {
        nombre
    };
    await pool.query("update roles set ? where id = ?", [newRol, id]);

    setTimeout(function() { res.redirect("/roles") }, 1000);
});

router.get("/list",isLoggedIn,masterRutes, async(req, res) => {
    const nombre = req.query.q;
    const roles = nombre != null && nombre != "" ? await
    pool.query("select id, nombre as text from roles where nombre like '%" + nombre + "%'"):
        await pool.query("select id,nombre as text from roles");
    res.send(roles);
});

module.exports = router;