const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');
const { isLoggedIn } = require('../config/auth');
const dateFormat = require("dateformat");
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const bitacora= async (log) => {
    await pool.query("insert into bitacora set ?",[log])
};


const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/images/rifas'),
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname));
    }
});
const imgSave = (multer({
    storage,
    dest: path.join(__dirname, '../public/images/rifas'),
    fileFilter: function(req, file, cb) {

        var filetypes = /jpeg|jpg|png|gif/;
        var mimetype = filetypes.test(file.mimetype);
        var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb("Error: File upload only supports the following filetypes - " + filetypes);
    },
    limits: { fileSize: 1000000 },
}));

//RUTAS

router.get("/list", async(req, res) => {
    const cod_rifa = req.query.q;
    const rifas = cod_rifa != null ? await
    pool.query("select id, concat(codigo_rifa) as text from rifas where codigo_rifa like '%" + cod_rifa + "%'"): await
    pool.query("select id,codigo_rifa as text from rifas");

    res.json(rifas);


});



router.get('/add', isLoggedIn, (req, res) => {
   // res.render("hola")
    res.render('rifas/add', { title: "Alta Rifa - Bruji Rifas" });
});
//ruta para guardar los rifas
router.post("/add", isLoggedIn, imgSave.single('imagen'), async(req, res) => {

    // Obtenemos el ultimo codigo, insert en la base de datos
    const lastestItem = await pool.query('SELECT codigo_rifa FROM rifas ORDER BY codigo_rifa DESC LIMIT 1');
    date = new Date();
    const {
        nombre,
        descripcion,
        fecha_inicio,
        fecha_fin,
        id_producto,
        dias_limite_retiro,
        num_boletos,

    } = req.body;
    const imagen = req.file.filename;
    var fecha_registro = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    // Codigo incrementado automaticamente 
    const dateByYear = date.getFullYear();
    var codigo_rifa = lastestItem.length === 0 ? dateByYear + '01' : parseInt(lastestItem[0].codigo_rifa) + 1;
    const newRifa = {
        codigo_rifa,
        nombre,
        descripcion,
        fecha_inicio,
        fecha_fin,
        fecha_registro,
        id_producto,
        dias_limite_retiro,
        num_boletos,
        imagen
    };
    const id_empleado =  req.app.locals.user.id_empleado;
   // const fecha_registro  = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    var accion =  "Ingreso una rifa";
    var host ="brujirifas";
    var tabla = "rifas";
    const log = {
        id_empleado,
        fecha_registro,
        accion,
        tabla,
        host
    }
    //await pool.query("insert into rifas set ?", [newRifa]);
    await pool.query("insert into rifas set ?", [newRifa], (error, succcess) => {
        if (!error) {
            bitacora(log)
            req.flash('message', 'Eliminado con éxito')
            res.redirect('/rifas');
        } else {
            req.flash('message', 'Ocurrió un error inesperado')
            res.redirect('/rifas');
        }
    });
});

//ruta para listar los rifas
router.get("/", isLoggedIn, async(req, res) => {
    const rifas = await pool.query(`select b.id as id_rifa,a.nombre as nombre_producto, b.codigo_rifa,b.nombre,b.descripcion
    ,b.fecha_inicio,b.fecha_fin,b.fecha_registro,b.dias_limite_retiro from productos a INNER JOIN rifas b on a.id = b.id_producto`);
    res.render("rifas/list", { rifas: rifas, title: "Rifas - Bruji Rifas", message: req.flash('message') });

});

//ruta para eliminar rifa
router.get("/delete/:codigo_rifa", isLoggedIn, async(req, res) => {

    const id_empleado =  req.app.locals.user.id_empleado;
    const fecha_registro  = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    var accion =  "Eliminó una rifa";
    var host ="brujirifas";
    var tabla = "rifas";
    const log = {
        id_empleado,
        fecha_registro,
        accion,
        tabla,
        host
    }
    const codigo_rifa = req.params.codigo_rifa;
   // await pool.query('delete from rifas where codigo_rifa = ?', codigo_rifa);
    await pool.query('delete from rifas where codigo_rifa = ?', codigo_rifa, (error, succcess) => {
        if (!error) {
            bitacora(log)
            req.flash('message', 'Eliminado con éxito')
            res.redirect('/rifas');
        } else {
            req.flash('message', 'Ocurrió un error inesperado')
            res.redirect('/rifas');
        }
    });
})

//ruta que recibe el id para llenar el formulario o la vista
router.get("/edit/:codigo_rifa", isLoggedIn, async(req, res) => {
    const codigo_rifa = req.params.codigo_rifa;
    const rifa = await pool.query(`select a.id as id_producto, a.nombre as nombre_producto, b.codigo_rifa,b.nombre,b.descripcion
    ,b.fecha_inicio,b.fecha_fin,b.dias_limite_retiro from productos a INNER JOIN rifas b on a.id = b.id_producto where codigo_rifa = ?`, codigo_rifa);
    res.render("rifas/edit", { rifa: rifa[0], title: "Editar Rifa - Bruji Rifas" });

});

//ruta que recibe el id del para actualizar en la base de datos
router.post("/edit/:codigo_rifa", isLoggedIn, async(req, res) => {
    const codigo_rifa = req.params.codigo_rifa;
    const {
        nombre,
        descripcion,
        fecha_inicio,
        fecha_fin,
        id_producto,
        dias_limite_retiro
    } = req.body;
    const newRifa = {
        nombre,
        descripcion,
        fecha_inicio,
        fecha_fin,
        id_producto,
        dias_limite_retiro
    };
    const id_empleado =  req.app.locals.user.id_empleado;
    const fecha_registro  = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    var accion =  "Edito una rifa";
    var host ="brujirifas";
    var tabla = "rifas";
    const log = {
        id_empleado,
        fecha_registro,
        accion,
        tabla,
        host
    }
    //await pool.query("update rifas set ? where codigo_rifa = ?", [newRifa, codigo_rifa]);
    await pool.query("update rifas set ? where codigo_rifa = ?", [newRifa, codigo_rifa], (error, succcess) => {
        if (!error) {
            bitacora(log)
            req.flash('message', 'Guardado con éxito')
            res.redirect('/rifas');
        } else {
            req.flash('message', 'Ocurrió un error inesperado')
            res.redirect('/rifas');
        }
    });
});

module.exports = router;