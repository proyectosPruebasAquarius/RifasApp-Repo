const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');
const { isLoggedIn,masterRutes } = require('../config/auth');

//ruta para listar los rolesempleados
router.get("/",isLoggedIn,masterRutes , async(req, res) => {
    const rolesEmpleados = await pool.query("select c.id as id_rolE,a.nombre as rol,concat(b.cod_empleado,' - ',b.nombres,' - ',b.apellidos) as empleado from roles_empleados as c inner join roles as a on c.id_rol=a.id inner join empleados_personales as b on c.id_empleado=b.id");
    res.render("rolesEmpleados/list", { rolesEmpleados: rolesEmpleados, title: "Roles Empleados - Bruji Rifas", message: req.flash('message') });
});
router.get('/add',isLoggedIn,masterRutes , (req, res) => {
    res.render('rolesEmpleados/add', { title: "Alta Rol Empleado - Bruji Rifas" });
});
//ruta para guardar los rolesEmpleados
router.post("/add",isLoggedIn,masterRutes , async(req, res) => {
    const {
        id_empleado,
        id_rol
    } = req.body;
    const newRolEmpleado = {
        id_empleado,
        id_rol
    };
    await pool.query("insert into roles_empleados set ?", [newRolEmpleado], (error, succcess) => {
        if (!error) {
            req.flash('message', 'Guardado con éxito')
            res.redirect('/rol_Empleados');
        } else {
            req.flash('message', 'Ocurrió un error inesperado')
            res.redirect('/rol_Empleados');
        }
    });



});



//ruta para eliminar rol
router.get("/delete/:id",isLoggedIn,masterRutes , async(req, res) => {
    const id = req.params.id;
    await pool.query('delete from roles_empleados where id = ?', id);
    const success = req.flash('success', 'Registro Eliminado correctamente!');
    res.redirect("/rol_Empleados");
})

//ruta que recibe el id para llenar el formulario o la vista
router.get("/edit/:id",isLoggedIn,masterRutes , async(req, res) => {
    const id = req.params.id;
    const rolesEmpleado = await pool.query('select c.id ,a.id as id_rol,a.nombre as rol,b.id as id_empleado,concat(b.cod_empleado," - ",b.nombres," - ",b.apellidos) as empleado from roles_empleados as c inner join roles as a on c.id_rol=a.id inner join empleados_personales as b on c.id_empleado=b.id where c.id = ?', id);
    res.render("rolesEmpleados/edit", { rolesEmpleado: rolesEmpleado[0], title: "Editar Rol Empleado - Bruji Rifas" });

});

//ruta que recibe el id del para actualizar en la base de datos
router.post("/edit/:id",isLoggedIn,masterRutes , async(req, res) => {
    const id = req.params.id;
    const {
        id_empleado,
        id_rol
    } = req.body;

    const newRolEmpleado = {
        id_empleado,
        id_rol
    };
    console.log(newRolEmpleado);
    await pool.query("update roles_empleados set ? where id=?", [newRolEmpleado, id]);
    setTimeout(function() {
        res.redirect("/rol_Empleados");
    }, 1000)

});

router.get("/empleados/list",isLoggedIn,masterRutes , async(req, res) => {
    const nombre = req.query.q;
    const empleados = nombre != null && nombre != "" ? await
    pool.query("select id, concat(cod_empleado,' - ',nombres,' - ',apellidos) as text from empleados_personales where cod_empleado like '%" + nombre + "%'"):
        await pool.query("select id,concat(cod_empleado,' - ',nombres,' - ',apellidos) as text from empleados_personales");
    res.send(empleados);
});

module.exports = router;