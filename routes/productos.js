const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const dateFormat = require("dateformat");


const bitacora = async (log) => {
    await pool.query("insert into bitacora set ?",[log])
};

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/images/productos'),
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname));
    }
});
const imgSave = (multer({
    storage,
    dest: path.join(__dirname, '../public/images/productos'),
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


router.get('/add', (req, res) => {
    res.render('productos/add', { title: "Alta Producto - Bruji Rifas" });
})

//ruta para guardar los productos
router.post("/add", imgSave.single('imagen'), async(req, res) => {
    const {

        nombre,
        id_marca,
        id_categoria,
        descripcion,
        url_fabricante
    } = req.body;
    const imagen = req.file.filename;
    const id_empleado =  req.app.locals.user.id_empleado;
    const fecha_registro  = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");

    const newProducto = {
        nombre,
        id_marca,
        id_categoria,
        imagen,
        descripcion,
        url_fabricante,
       
    };
    var accion =  "Ingreso un nuevo producto";
    var host ="brujirifas";
    var tabla = "productos";
    const log = {
        id_empleado,
        fecha_registro,
        accion,
        tabla,
        host
    }
   
    await pool.query("insert into productos set ?", [newProducto], (error, success) => {
      
        
        if (!error) {
            bitacora(log)
            req.flash('message', 'Guardado con éxito')
            res.redirect('/productos');
        } else {
            req.flash('message', 'Ocurrió un error inesperado')
            res.redirect('/productos');
        }
    });

});

//ruta para listar los productos
router.get("/", async(req, res) => {

    const productos = await pool.query(`select a.id,a.nombre,a.descripcion,a.url_fabricante,b.nombre as marca,c.nombre as categoria from productos as a inner join 
    marcas as b on a.id_marca = b.id inner join categorias as c on a.id_categoria = c.id order by a.id asc`);
    res.render("productos/list", { productos: productos, title: "Productos - Bruji Rifas", message: req.flash('message') });
});

router.get("/list", async(req, res) => {
    const nombre = req.query.nombre;
    const productos = nombre != null ? await
    pool.query("select id, concat(nombre) as text from productos where nombre like '%" + nombre + "%'"): await
    pool.query("select id,nombre as text from productos");

    res.send(productos);

});

//ruta para eliminar producto
router.get("/delete/:id", async(req, res) => {
    var accion =  "Eliminó un producto";
    var host ="brujirifas";
    var tabla = "productos";
    const log = {
        id_empleado,
        fecha_registro,
        accion,
        tabla,
        host
    }
   
    const id = req.params.id;
   // await pool.query('delete from productos where id = ?', id);
    await pool.query('delete from productos where id = ?', id, (error, success) => {
      
       
        if (!error) {
            bitacora(log)
            req.flash('message', 'Eliminado con éxito')
            res.redirect('/productos');
        } else {
            req.flash('message', 'Ocurrió un error inesperado')
            res.redirect('/productos');
        }
    });
});

//ruta que recibe el id para llenar el formulario o la vista
router.get("/edit/:id", async(req, res) => {
    const id = req.params.id;
    const producto = await pool.query(`select a.imagen,a.id,a.nombre,a.descripcion,a.url_fabricante,b.nombre as marca,b.id as id_marca,c.nombre as categoria,c.id as id_categoria from productos as a inner join 
    marcas as b on a.id_marca = b.id inner join categorias as c on a.id_categoria = c.id  where a.id = ?`, id);
    res.render("productos/edit", { producto: producto[0], title: "Editar Producto - Bruji Rifas" });

});

//ruta que recibe el id del para actualizar en la base de datos
router.post("/edit/:id", async(req, res) => {
    const id = req.params.id;
    const {
        nombre,
        id_marca,
        id_categoria,
        descripcion,
        url_fabricante
    } = req.body;
    const newProducto = {
        nombre,
        id_marca,
        id_categoria,
        descripcion,
        url_fabricante
    };
    const id_empleado =  req.app.locals.user.id_empleado;
    const fecha_registro  = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    var accion =  "Se edito un producto";
    var host ="brujirifas";
    var tabla = "productos";
    const log = {
        id_empleado,
        fecha_registro,
        accion,
        tabla,
        host
    }

    await pool.query("update productos set ? where id = ?", [newProducto, id], (error, succcess) => {
        if (!error) {
            bitacora(log)
            req.flash('message', 'Guardado con éxito')
            res.redirect('/productos');
        } else {
            req.flash('message', 'Ocurrió un error inesperado')
            res.redirect('/productos');
        }
    });


});

module.exports = router;