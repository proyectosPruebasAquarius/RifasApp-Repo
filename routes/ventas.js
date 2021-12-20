const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');
const dateFormat = require("dateformat");
const { Result } = require('express-validator');
const { json } = require('body-parser');
/*const bitacora= async (log) => {
    await pool.query("insert into bitacora set ?",[log])
};*/
// Index 
router.get('/', async(req, res) => {

    const ventas = await pool.query(`SELECT a.*, concat(b.nombres, " " ,b.apellidos) as cliente, concat(c.cod_empleado, " - ", d.nombres, " ", d.apellidos) as empleado FROM ventas as a 
    inner join clientes as b on a.id_cliente = b.id inner join empleados_laborales as c on a.id_empleado = c.id inner join empleados_personales as d on c.cod_empleado = d.cod_empleado`);
    res.render("ventas/list", { ventas: ventas, title: "Ventas - Bruji Rifas" });
});

// Get renderisar plantilla
router.get('/add', (req, res) => {
    res.render('ventas/add', { title: "Alta Ventas - Bruji Rifas" });
})

// Get para renderisar vista con el item
router.get("/edit/:id", async(req, res) => {

    const id = req.params.id;
    const venta = await pool.query('select * from ventas where id = ?', id);
    res.render("ventas/edit", { venta: venta[0], title: "Editar Venta - Bruji Rifas" });

});

//ruta que recibe el id del para actualizar en la base de datos
router.post("/edit/:id", async(req, res) => {
    const id = req.params.id;
    const {
        // id,
        // Verificar si se editará, para usar id y en un select traer el codigo...
        id_cliente,
        forma_pago,
        fecha_pago,
        num_transaccion,
        total,
        id_empleado
    } = req.body;
    const newVenta = {
        // id,
        id_cliente,
        forma_pago,
        fecha_pago,
        num_transaccion,
        total,
        id_empleado
    };
    //const id_empleado =  req.app.locals.user.id_empleado;
    const fecha_registro  = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");    
    var accion =  "Edito una venta";
    var host ="brujirifas";
    var tabla = "ventas";
    const log = {
        id_empleado,
        fecha_registro,
        accion,
        tabla,
        host
    }
    await pool.query("update ventas set ? where id = ?", [newVenta, id]);
    bitacora(log)
    const success = req.flash('success', 'Registro Actualizado correctamente!');
    res.redirect("/ventas");
});


router.post('/transaccion', async(req, res) => {

    let {
        id_cliente,
        forma_pago,
        total,
        id_boleto
    } = req.body;
  /*  const id_empleado =  req.app.locals.user.id_empleado;
    const fecha_registro  = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    var accion =  "Ingreso una venta";
    var host ="brujirifas";
    var tabla = "ventas";
    const log = {
        id_empleado,
        fecha_registro,
        accion,
        tabla,
        host
    }*/
    const cliente = await pool.query('select id_cliente from usuarios  where id = ?', id_cliente);

    id_cliente = cliente[0].id_cliente;
    console.log({ idDelCliente: id_cliente });
    pool.getConnection(function(err, connection) {
        connection.beginTransaction(function(err) {
            if (err) { throw err; } //"yyyy-mm-dd h:MM:ss"
            /// console.log({ errorDeConecc: err });
            let fecha_pago = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");

            console.log({ Fecha: fecha_pago });
            let num_transaccion = 1;
            const newVenta = {

                id_cliente,
                forma_pago,
                fecha_pago,
                num_transaccion,
                total

            };
            console.log({ newVenta: newVenta });

            const sql = "INSERT INTO ventas (id_cliente, forma_pago, fecha_pago,fecha_pago,total) VALUES ?";
            connection.query('INSERT INTO ventas SET ?', [newVenta], function(err, result) {

                console.log({ errorDeInsert: err });
                const id_final = result;
                if (err) {
                    connection.rollback(function() {
                        throw err;
                    });
                }
                console.log({ result: id_final });
                const ArrayDetail = []
                let ArrayNumeros = [req.app.locals.productos]

                for (let index = 0; index < ArrayNumeros.length; index++) {

                    for (let index2 = 0; index2 < ArrayNumeros[index].length; index2++) {
                        const element = ArrayNumeros[index][index2];
                        console.log({ element: element });
                        ArrayNumeros[index][index2].No.forEach(element => {
                            console.log({ for_Eacj: element });
                            ArrayDetail.push([ArrayNumeros[index][index2].item.id_boleto, id_final.insertId, element])
                        });
                    }
                }

                console.log({ Array_Detail: ArrayDetail });


                //INSERT FINAL DE LA TRANSASCCION
                const sqldetail = "INSERT INTO detalle_venta (id_boleto, id_venta, numero) VALUES ?";
                connection.query(sqldetail, [ArrayDetail], function(err, result) {
                    if (err) {
                        connection.rollback(function() {
                            throw err;
                        });
                    }
                    connection.commit(function(err) {
                        if (err) {
                            connection.rollback(function() {
                                throw err;
                            });
                        }
                       // bitacora(log)
                        console.log('success!');
                        delete req.session.cart

                        res.redirect('/inicio')
                    });
                });



            });
        });
    });

});

module.exports = router;