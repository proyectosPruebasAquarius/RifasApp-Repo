var express = require("express");
var router = express.Router();
const helpers = require("../config/helpers");
const passport = require("passport");
const pool = require("../config/db.config");




//Ruta para guardar un usuario y cliente a la vez
router.post('/transaccion', async(req, res) => {
    const url = req.body.url2;
    console.log({ url: url });


    const {

        nombres,
        apellidos,
        DUI,
        email,
        celular,
        fecha_nac,
        password

    } = req.body;

    let encryptPass = password;
    encryptPass = await helpers.encryptPassword(encryptPass);


    pool.getConnection(function(err, connection) {
        connection.beginTransaction(function(err) {
            const newCliente = {
                nombres,
                apellidos,
                DUI,
                email,
                celular,
                fecha_nac,
            };
            if (err) { throw err; }
            connection.query('INSERT INTO clientes SET ?', newCliente, function(err, result) {


                if (err) {
                    connection.rollback(function() {
                        throw err;
                    });
                }
                const {

                    password,
                    nombre,

                } = req.body;
                let id_cliente = result.insertId
                let id_tipo_usuario = 3;
                let estado = 1;

                let newUser = {
                    password,
                    nombre,
                    id_tipo_usuario,
                    estado,
                    id_cliente
                };
                newUser.password = encryptPass;
                //INSERT FINAL DE LA TRANSASCCION
                connection.query('INSERT INTO usuarios SET ?', newUser, function(err, result) {
                    const user = { username: newUser.nombre, password: newUser.password, id: result.insertId }
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
                        if (url == '/carrito') {
                            console.log({ user: user });
                            req.login(user, function(err) {
                                if (err) {
                                    console.log(err);
                                }
                                return res.redirect('/carrito');
                            });
                        } else {
                            return res.redirect('/inicio');
                        }
                    });
                });



            });
        });
    });

});



module.exports = router;