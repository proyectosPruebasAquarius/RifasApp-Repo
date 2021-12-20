const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const dateFormat = require("dateformat");
const bitacora= async (log) => {
    await pool.query("insert into bitacora set ?",[log])
};



router.get("/mostrar", async(req, res) => {
    const publicaciones = await pool.query(`select b.nombre as producto,a.titulo,a.descripcion,a.contenido,a.fecha as fecha_publicacion, a.imagen from publicaciones as a inner join rifas as b on a.id_rifa=b.id`);
    res.render("publicaciones/mostrar", { publicaciones: publicaciones, title: "Publicaciones - Bruji Rifas" });

});

router.get('/add', (req, res) => {
    res.render('publicaciones/add', { title: "Alta Publicación - Bruji Rifas" });
});

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/images/publicaciones'),
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname));
    }
});
const imgSave = (multer({
    storage,
    dest: path.join(__dirname, '../public/images/publicaciones'),
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

//ruta para guardar los publicaciones
router.post("/add", imgSave.single('imagen'), async(req, res) => {
    const {
        titulo,
        descripcion,
        contenido,
        id_rifa,
    } = req.body;
    const imagen = req.file.filename;
    var fecha = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    var estado = 1;
    /*FALTA PONER EL CODIGO DEL EMPLEADO QUE HIZO LA PUBLICACIÓN*/
    var cod_empleado = "A001"
    const newPublicacion = {
        titulo,
        descripcion,
        contenido,
        estado,
        imagen,
        fecha,
        cod_empleado,
        id_rifa
    };
    const id_empleado =  req.app.locals.user.id_empleado;
    const fecha_registro  = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    var accion =  "Ingreso una publicación";
    var host ="brujirifas";
    var tabla = "publicaciones";
    const log = {
        id_empleado,
        fecha_registro,
        accion,
        tabla,
        host
    }
    await pool.query("insert into publicaciones set ?", [newPublicacion], (error, succcess) => {
        if (!error) {
            bitacora(log)
            req.flash('message', 'Guardado con éxito')
            res.redirect('/publicaciones');
        } else {
            req.flash('message', 'Ocurrió un error inesperado')
            res.redirect('/publicaciones');
        }
    });

});

//ruta para listar los publicaciones
router.get("/", async(req, res) => {
    const publicaciones = await pool.query("select b.nombre as producto,a.* from publicaciones as a inner join rifas as b on a.id_rifa=b.id inner join productos as c on b.id_producto=c.id");
    res.render("publicaciones/list", { publicaciones: publicaciones, title: "Publicaciones - Bruji Rifas", message: req.flash('message') });
});

//ruta para eliminar publicacion
router.get("/delete/:id", async(req, res) => {
    const id_empleado =  req.app.locals.user.id_empleado;
    const fecha_registro  = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    var accion =  "Eliminó una publicación";
    var host ="brujirifas";
    var tabla = "publicaciones";
    const log = {
        id_empleado,
        fecha_registro,
        accion,
        tabla,
        host
    }
    const id = req.params.id;
   // await pool.query('delete from publicaciones where id = ?', id);
    await pool.query('delete from publicaciones where id = ?', id, (error, succcess) => {
        if (!error) {
            bitacora(log)
            req.flash('message', 'Eliminado con éxito')
            res.redirect('/publicaciones');
        } else {
            req.flash('message', 'Ocurrió un error inesperado')
            res.redirect('/publicaciones');
        }
    });
   
})

//ruta que recibe el id para llenar el formulario o la vista
router.get("/edit/:id", async(req, res) => {
    const id = req.params.id;
    const publicacion = await pool.query('select a.*,b.codigo_rifa from publicaciones as a inner join rifas as b on a.id_rifa=b.id where a.id = ?', id);
    res.render("publicaciones/edit", { publicacion: publicacion[0], title: "Editar Publicación - Bruji Rifas" });

});

//ruta que recibe el id del para actualizar en la base de datos
router.post("/edit/:id", async(req, res) => {
    const id = req.params.id;
    const id_empleado =  req.app.locals.user.id_empleado;
    const fecha_registro  = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    var accion =  "Edito una publicación";
    var host ="brujirifas";
    var tabla = "publicaciones";
    const log = {
        id_empleado,
        fecha_registro,
        accion,
        tabla,
        host
    }
    const {
        titulo,
        descripcion,
        contenido,
        id_rifa
    } = req.body;
    const newPublicacion = {
        titulo,
        descripcion,
        contenido,
        id_rifa
    };
    //await pool.query("update publicaciones set ? where id = ?", [newPublicacion, id]);
    await pool.query("update publicaciones set ? where id = ?", [newPublicacion, id], (error, succcess) => {
        if (!error) {
            bitacora(log)
            req.flash('message', 'Guardado con éxito')
            res.redirect('/publicaciones');
        } else {
            req.flash('message', 'Ocurrió un error inesperado')
            res.redirect('/publicaciones');
        }
    });
   
   
});

module.exports = router;