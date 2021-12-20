var express = require("express");
const dateFormat = require("dateformat");
const pool = require("../config/db.config");
const nodemailer = require("nodemailer");
var router = express.Router();
//const { isLoggedIn } = require('../config/auth');

router.get("/", async function(req, res, next) {
    const cliente = await pool.query('SELECT a.*, CONCAT(a.nombres," ",a.apellidos) AS fullName FROM clientes AS a WHERE a.id = ?', req.app.locals.user.id_cliente);
    const compras = await pool.query('SELECT a.forma_pago, a.fecha_pago,a.total,b.numero,e.nombre as nombre_rifa from ventas as a inner join detalle_venta as b on b.id_venta = a.id inner join boletos as c on b.id_boleto=c.id inner join rifas as e on c.id_rifa = e.id  where id_cliente = ?', req.app.locals.user.id_cliente)
    res.render("publics_views/perfil/perfil", {
        title: "Perfil - Bruji Rifas",
        cliente: cliente[0],
        compras: compras,
        message: req.flash('message')
    });
});

router.post('/edit/:id', async(req, res) => {
    const id = req.params.id;
    let {
        nombres,
        apellidos,
        fecha_nac,
        DUI,
        nombre,
        //telefono,
        celular,
        email
        //id_municipio,
        //direccion,
    } = req.body;
    var mod = await pool.query('select modificado, modificado_fecha from clientes where id = ?', id);

    //console.log(DUI, fecha_nac)
    /*if (mod[0].modificado == null) {
        //console.log('prueba')
        //console.log(mod)
        modificado = 1;
    } else {
        //modificado += mod[0].modificado;
        modificado = 2;
        console.log(modificado)
    }*/

    // Si viene vacio ingresa la peticion si no el nuevo valor
    const isNull = await pool.query('select fecha_nac, DUI from clientes where id = ?', id);
    DUI = DUI == null ? isNull[0].DUI : DUI
    fecha_nac = fecha_nac == null ? isNull[0].fecha_nac : fecha_nac
    var fecha_modificacion = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");

    // Si mod es igual a null y el valor enviado es distinto del valor guardo = 1, pero si mod es igual a 1 y los valores son distinto es igual a 2, si no es igual al mismo valor guardado en DB
    let modificado = mod[0].modificado == null && DUI != isNull[0].DUI ? 1 : mod[0].modificado == 1 && DUI != isNull[0].DUI ? 2 : mod[0].modificado;

    let modificado_fecha = mod[0].modificado_fecha == null && fecha_nac != dateFormat(isNull[0].fecha_nac, 'yyyy-mm-dd') ? 1 : mod[0].modificado_fecha == 1 && fecha_nac != dateFormat(isNull[0].fecha_nac, 'yyyy-mm-dd') ? 2 : mod[0].modificado_fecha;
    console.log({
        fecha: DUI,
        peticion: isNull[0].modificado
    })
    const newCliente = {
        nombres,
        apellidos,
        DUI,
        ///telefono,
        celular,
        //direccion,
        //id_municipio,
        fecha_nac,
        // fecha_registro,
        fecha_modificacion,
        email,
        modificado,
        modificado_fecha
    };
    await pool.query('UPDATE usuarios SET nombre=? WHERE id_cliente=?', [nombre, id]);
    await pool.query('UPDATE clientes SET ? WHERE id = ?', [newCliente, id], (err, result) => {
        if (!err) {
            req.flash('message', 'Actualizado con éxito')
            res.redirect('/perfil');
        } else {
            req.flash('message', 'Ocurriò un error inesperado')
            res.redirect('/perfil');
            console.log(err)
        }
    });
});



// Dar de Baja un perfil
router.get('/desactivar', async(req, res) => {
    const id = req.app.locals.user.id;
    const newEstado = {
        estado: 0
    };
    await pool.query('update usuarios set ? where id = ?', [newEstado, id], (err, result) => {
        if (!err) {
            // req.flash('message', 'Actualizado con éxito')
            req.logout();
            res.redirect('/inicio');
        } else {
            ///// req.flash('message', 'Ocurriò un error inesperado')
            res.redirect('/inicio');
            console.log(err)
        }
    });
});


router.get('/email', async(req, res) => {
    contentHTML = `
                    <h1></h1>
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
        subject: '¡Ganador!',
        text: '¡Felicidades has sido el ganador de nuestra rifa!',

        attachments: [{
            filename: 'ganador.jpg',
            path: './public/images/publicaciones/Principal.jpg',
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


/* API ANDROID */
router.get("/android/:id", async (req, res) => {

    const android = req.params.id;
    
    const cliente = await pool.query('SELECT a.*, CONCAT(a.nombres," ",a.apellidos) AS fullName FROM clientes AS a WHERE a.id = ?', android);
    const compras = await pool.query('SELECT * from ventas where id_cliente = ?', android);
    
    res.send({
        //title: "Perfil - Bruji Rifas",
        cliente: cliente[0],
        compras: compras,
       // message: req.flash('message')
    });

});

router.post('/edit/android/:id', async(req, res) => {
    const id = req.params.id;
    let {
        nombres,
        apellidos,
        fecha_nac,
        DUI,
        nombre,
        //telefono,
        celular,
        email
        //id_municipio,
        //direccion,
    } = req.body;
    var mod = await pool.query('select modificado, modificado_fecha from clientes where id = ?', id);

    //console.log(DUI, fecha_nac)
    /*if (mod[0].modificado == null) {
        //console.log('prueba')
        //console.log(mod)
        modificado = 1;
    } else {
        //modificado += mod[0].modificado;
        modificado = 2;
        console.log(modificado)
    }*/

    // Si viene vacio ingresa la peticion si no el nuevo valor
    const isNull = await pool.query('select fecha_nac, DUI from clientes where id = ?', id);
    DUI = DUI == null ? isNull[0].DUI : DUI
    fecha_nac = fecha_nac == null ? isNull[0].fecha_nac : fecha_nac
    var fecha_modificacion = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");

    // Si mod es igual a null y el valor enviado es distinto del valor guardo = 1, pero si mod es igual a 1 y los valores son distinto es igual a 2, si no es igual al mismo valor guardado en DB
    let modificado = mod[0].modificado == null && DUI != isNull[0].DUI ? 1 : mod[0].modificado == 1 && DUI != isNull[0].DUI ? 2 : mod[0].modificado;

    let modificado_fecha = mod[0].modificado_fecha == null && fecha_nac != dateFormat(isNull[0].fecha_nac, 'yyyy-mm-dd') ? 1 : mod[0].modificado_fecha == 1 && fecha_nac != dateFormat(isNull[0].fecha_nac, 'yyyy-mm-dd') ? 2 : mod[0].modificado_fecha;
    console.log({
        fecha: DUI,
        peticion: isNull[0].modificado
    })
    const newCliente = {
        nombres,
        apellidos,
        DUI,
        ///telefono,
        celular,
        //direccion,
        //id_municipio,
        fecha_nac,
        // fecha_registro,
        fecha_modificacion,
        email,
        modificado,
        modificado_fecha
    };

    console.log(`datos ${newCliente.nombres}`);
    await pool.query('UPDATE usuarios SET nombre=? WHERE id_cliente=?', [nombre, id]);
    await pool.query('UPDATE clientes SET ? WHERE id = ?', [newCliente, id], (err, result) => {
        if (!err) {
            console.log("entre");
            res.sendStatus(200);
        } else {
            console.log("falle");
            res.sendStatus(500);
        }
    });
});



module.exports = router;