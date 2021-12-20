const express = require('express');
const nodemailer = require("nodemailer");
const router = express.Router();
const pool = require('../config/db.config');
const dateFormat = require("dateformat");

const bitacora= async (log) => {
    await pool.query("insert into bitacora set ?",[log])
};


router.get('/add', (req, res) => {
    res.render('boletos/add', { title: "Alta Boleto - Bruji Rifas" });
});

router.get("/mostrar", async(req, res) => {
    const boletos = await pool.query(`select a.imagen,a.nombre as nombre_producto, b.codigo_rifa,b.nombre,b.descripcion,b.fecha_fin from productos a INNER JOIN rifas b on a.id = b.id_producto`);
    res.render("boletos/prueba", { boletos: boletos, title: "Rifas - Bruji Rifas" });

});
//ruta para guardar los boletos
router.post("/add", async(req, res) => {
    const {
        precio,
        num_inicial,
        num_final,
        id_rifa,
    } = req.body;
    const newBoleto = {
        precio,
        num_inicial,
        num_final,
        id_rifa,

    };
    const id_empleado =  req.app.locals.user.id_empleado;
    const fecha_registro  = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    var accion =  "Ingreso un boleto";
    var host ="brujirifas";
    var tabla = "boletos";
    const log = {
        id_empleado,
        fecha_registro,
        accion,
        tabla,
        host
    }
    await pool.query("insert into boletos set ?", [newBoleto], (error, succcess) => {
        if (!error) {
            bitacora(log)
            req.flash('message', 'Guardado con éxito')
            res.redirect('/boletos');
        } else {
            req.flash('message', 'Ocurrió un error inesperado')
            res.redirect('/boletos');
        }
    });

});
router.get("/prueba", async(req, res) => {

    res.render("boletos/prueba");
});
//ruta para listar los boletos
router.get("/", async(req, res) => {
    const boletos = await pool.query("select a.id, a.precio,a.num_inicial,num_final, b.codigo_rifa from boletos as a inner join rifas as b on a.id_rifa = b.id");
    res.render("boletos/list", { boletos: boletos, title: "Boletos - Bruji Rifas", message: req.flash('message') });
});

//ruta para eliminar boleto
router.get("/delete/:id", async(req, res) => {
    var accion =  "Eliminó un boleto";
    var host ="brujirifas";
    var tabla = "boletos";
    const id_empleado =  req.app.locals.user.id_empleado;
    const fecha_registro  = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    const log = {
        id_empleado,
        fecha_registro,
        accion,
        tabla,
        host
    }
    const id = req.params.id;
    //await pool.query('delete from boletos where id = ?', id);
    await pool.query('delete from boletos where id = ?', id, (error, success) => {
      
        
        if (!error) {
            bitacora(log)
            req.flash('message', 'Eliminado con éxito')
            res.redirect('/boletos');
        } else {
            req.flash('message', 'Ocurrió un error inesperado')
            res.redirect('/boletos');
        }
    });
})

//ruta que recibe el id para llenar el formulario o la vista
router.get("/edit/:id", async(req, res) => {
    const id = req.params.id;
    const boleto = await pool.query('select a.id, a.precio,a.num_inicial,num_final, b.codigo_rifa from boletos as a inner join rifas as b on a.id_rifa = b.id where a.id = ?', id);
    res.render("boletos/edit", { boleto: boleto[0], title: "Editar Boleto - Bruji Rifas" });

});

//ruta que recibe el id del para actualizar en la base de datos
router.post("/edit/:id", async(req, res) => {
    const id = req.params.id;
    const {
        precio,
        num_inicial,
        num_final,
        id_rifa,

    } = req.body;
    const newBoleto = {
        precio,
        num_inicial,
        num_final,
        id_rifa,

    };
    var accion =  "Edito un boleto";
    var host ="brujirifas";
    var tabla = "boletos";
    const id_empleado =  req.app.locals.user.id_empleado;
    const fecha_registro  = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    const log = {
        id_empleado,
        fecha_registro,
        accion,
        tabla,
        host
    }
    //await pool.query("update boletos set ? where id = ?", [newBoleto, id]);
    await pool.query("update boletos set ? where id = ?", [newBoleto, id], (error, success) => {
      
        
        if (!error) {
            bitacora(log)
            req.flash('message', 'Guardado con éxito')
            res.redirect('/boletos');
        } else {
            req.flash('message', 'Ocurrió un error inesperado')
            res.redirect('/boletos');
        }
    });
});
router.get('/email', async(req, res) => {
    contentHTML = `
                    <h1> Pedido Completado</h1> 
                    <br>
                    <h4>Monto:$ <span style="color:red;">5.00</span> </h4>
                    <h3>Gracias Por Su Compra</h3>
    `;
    var transporter = nodemailer.createTransport({
        pool: true,
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'brujirifas.contact@gmail.com',
            pass: 'hola1234510'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    var mailOptions = {
        from: 'brujirifas.contact@gmail.com',
        to: 'elia.informatic@gmail.com',
        subject: 'Noticación de pago',
        html: contentHTML,

        attachments: [{
            filename: 'rifa.jpg',
            path: './public/assets/images/productos/consola.png',
            //cid : 'image1@johnson.com'
        }]
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    //console.log(info.messageId);
})
module.exports = router;