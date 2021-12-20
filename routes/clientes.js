const express = require("express");
const router = express.Router();
const dateFormat = require("dateformat");
const pool = require("../config/db.config");
const { isLoggedIn } = require('../config/auth');

const bitacora= async (log) => {
    await pool.query("insert into bitacora set ?",[log])
};

//app.use(express.static(path.join(__dirname, 'public')));

router.get("/add", isLoggedIn, (req, res) => {
    res.render("clientes/add", { title: "Agregar Cliente - Bruji Rifas" });
    console.log(upload);
});

//ruta para subir una imagen


//ruta para guardar los clientes
router.post("/add", async(req, res) => {
    const {
        nombres,
        apellidos,
        fecha_nac,
        DUI,
        celular,
        email
    } = req.body;
    var fecha_registro = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    // var fecha_modificacion = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    const newCliente = {
        nombres,
        apellidos,
        DUI,
        celular,
        email,
        fecha_nac,
        fecha_registro,

    };
    const id_empleado =  req.app.locals.user.id_empleado;
    //const fecha_registro  = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    var accion =  "Ingreso un cliente";
    var host ="brujirifas";
    var tabla = "clientes";
    const log = {
        id_empleado,
        fecha_registro,
        accion,
        tabla,
        host
    }

    ///console.log(newCliente);
    await pool.query("insert into clientes set ?", [newCliente], (error, success) => {
        if (!error) {
            bitacora(log)
            req.flash('message', 'Guardado con éxito')
            res.redirect('/clientes');
        } else {
            req.flash('message', 'Ocurrió un error inesperado')
            res.redirect('/clientes');
        }
    });

});

//ruta para listar los clientes
router.get("/", async(req, res) => {
    const clientes = await pool.query("select id,nombres,apellidos,DUI,celular,email,fecha_nac,fecha_registro from clientes");
    res.render("clientes/list", { clientes: clientes, title: "Clientes - Bruji Rifas", message: req.flash('message') })
});



//ruta para eliminar
router.get("/delete/:id", isLoggedIn, async(req, res) => {
    const id_empleado =  req.app.locals.user.id_empleado;
    const fecha_registro  = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    var accion =  "Eliminó un cliente";
    var host ="brujirifas";
    var tabla = "clientes";
    const log = {
        id_empleado,
        fecha_registro,
        accion,
        tabla,
        host
    }
    const id = req.params.id;
    //await pool.query('delete from clientes where id = ?', id);
    await pool.query('delete from clientes where id = ?', id, (error, success) => {
        if (!error) {
            bitacora(log)
            req.flash('message', 'Eliminado con éxito')
            res.redirect('/clientes');
        } else {
            req.flash('message', 'Ocurrió un error inesperado')
            res.redirect('/clientes');
        }
    });

});

//ruta que recibe el id para llenar el formulario o la vista
router.get("/edit/:id", isLoggedIn, async(req, res) => {
    const id = req.params.id;
    const cliente = await pool.query('select id,nombres,apellidos,DUI,celular,email,fecha_nac,fecha_registro from clientes where id = ?', id);
    res.render("clientes/edit", { cliente: cliente[0], title: "Editar Clientes - Bruji Rifas" });
});

//ruta que recibe el id del para actualizar en la base de datos
router.post("/edit/:id", isLoggedIn, async(req, res) => {
    const id = req.params.id;
    const {
        nombres,
        apellidos,
        DUI,
        celular,
        email,
        fecha_nac
    } = req.body;

    const editCliente = {
        nombres,
        apellidos,
        DUI,
        celular,
        email,
        fecha_nac,

    };
    const id_empleado =  req.app.locals.user.id_empleado;
    const fecha_registro  = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    var accion =  "Edito un cliente";
    var host ="brujirifas";
    var tabla = "clientes";
    const log = {
        id_empleado,
        fecha_registro,
        accion,
        tabla,
        host
    }
    await pool.query("update clientes set ? where id = ?", [editCliente, id], (error, success) => {
        if (!error) {
            bitacora(log)
            req.flash('message', 'Guardado con éxito')
            res.redirect('/clientes');
        } else {
            req.flash('message', 'Ocurrió un error inesperado')
            res.redirect('/clientes');
        }
    });

});

module.exports = router;