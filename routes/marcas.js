const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');
const dateFormat = require("dateformat");

const bitacora= async (log) => {
    await pool.query("insert into bitacora set ?",[log])
};


router.get('/add', (req, res) => {
    res.render('marcas/add', { title: "Alta Marcas - Bruji Rifas" });
});


router.post("/add", async(req, res) => {
    const {
        nombre
    } = req.body;
    const newMarca = {
        nombre

    };
    const id_empleado =  req.app.locals.user.id_empleado;
    const fecha_registro  = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    var accion =  "Ingreso una marca";
    var host ="brujirifas";
    var tabla = "marcas";
    const log = {
        id_empleado,
        fecha_registro,
        accion,
        tabla,
        host
    }
    await pool.query("insert into marcas set ?", [newMarca], (error, success) => {
        if (!error) {
            bitacora(log)
            req.flash('message', 'Guardado con éxito')
            res.redirect('/marcas');
        } else {
            req.flash('message', 'Ocurrió un error inesperado')
            res.redirect('/marcas');
        }
    });

});


router.get("/", async(req, res) => {
    const marcas = await pool.query(`select * from marcas`);
    res.render('marcas/list', { marcas: marcas, title: "Marcas - Bruji Rifas", message: req.flash('message') });
});

router.get("/list", async(req, res) => {
    const nombre = req.query.q;
    const marcas = nombre != null ? await
    pool.query("select id, concat(nombre) as text from marcas where nombre like '%" + nombre + "%'"): await
    pool.query("select id,nombre as text from marcas");

    res.send(marcas);

});

//ruta para eliminar producto
router.get("/delete/:id", async(req, res) => {
    const id_empleado =  req.app.locals.user.id_empleado;
    const fecha_registro  = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    var accion =  "Eliminó una marca";
    var host ="brujirifas";
    var tabla = "marcas";
    const log = {
        id_empleado,
        fecha_registro, 
        accion,
        tabla,
        host
    }
    const id = req.params.id;
   // await pool.query('delete from marcas where id = ?', id);
    await pool.query('delete from marcas where id = ?', id, (error, success) => {
        if (!error) {
            bitacora(log)
            req.flash('message', 'Eliminado con éxito')
            res.redirect('/marcas');
        } else {
            req.flash('message', 'Ocurrió un error inesperado')
            res.redirect('/marcas');
        }
    });


});

//ruta que recibe el id para llenar el formulario o la vista
router.get("/edit/:id", async(req, res) => {
    const id = req.params.id;
    const marca = await pool.query('select * from marcas where id = ?', id);
    res.render("marcas/edit", { marca: marca[0], title: "Editar Cargo - Bruji Rifas" });
});

//ruta que recibe el id del para actualizar en la base de datos
router.post("/edit/:id", async(req, res) => {
    const id = req.params.id;
    const {
        nombre,

    } = req.body;
    const newMarca = {
        nombre,

    };
    const id_empleado =  req.app.locals.user.id_empleado;
    const fecha_registro  = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    var accion =  "Edito una marca";
    var host ="brujirifas";
    var tabla = "marcas";
    const log = {
        id_empleado,
        fecha_registro, 
        accion,
        tabla,
        host
    }
   // await pool.query("update marcas set ? where id = ?", [newMarca, id]);
    await pool.query("update marcas set ? where id = ?", [newMarca, id], (error, success) => {
        if (!error) {
            bitacora(log)
            req.flash('message', 'Guardado con éxito')
            res.redirect('/marcas');
        } else {
            req.flash('message', 'Ocurrió un error inesperado')
            res.redirect('/marcas');
        }
    });
   
});

module.exports = router;