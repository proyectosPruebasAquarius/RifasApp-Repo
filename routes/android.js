const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');
const passport = require("passport");
const jwt = require('jsonwebtoken');

router.get("/list_rifas", async(req, res) => {
    const rifas = await pool.query("select rifa.nombre, rifa.descripcion, DATE_FORMAT(rifa.fecha_inicio,'%d/%m/%Y')as fecha_inicio,DATE_FORMAT( rifa.fecha_fin,'%d/%m/%Y') as fecha_fin, producto.nombre as nombre_producto from rifas as rifa inner join productos as producto on rifa.id_producto=producto.id");
    res.send({ rifas: rifas });
});

router.post('/login', function(req, res, next) {


    //check("username").notEmpty().withMessage("Username is Required"),
    //check("password").notEmpty().withMessage("Password is Required"),
    passport.authenticate('local.login', function(err, user, message) {

        if (err) { return next(err); }
        // Route usuario comun
        let men = message;
        //if (user.id_tipo_usuario == 3) { res.redirect('/inicio') }
        //if (user.id_tipo_usuario != 3) { res.redirect('/') }
        req.logIn(user, { session: false }, function(err) {
            const token = jwt.sign({ user: user }, 'f435919a24b50f1466f5dec894340c64f68509c5054027188e4eb09997aa5dd3', { expiresIn: '15d' })

            if (err) { return next(err); }
            let estado;
            if (user.id != null) {
                estado = 1;
            } else {
                estado = 0;
            }
            if (men.message === 'PASSWORD INCORRECT' || men.message === 'DONT EXIST USERNAME') {
                return res.send({ message: men });
            } else {
            
                return res.send({ message: men.message, user: { user_id: user.id, username: user.nombre, estado: user.estado, token: token, id_cliente: user.id_cliente }, token: token });
            }



        });

    })(req, res, next);
})

router.get('/logout', (req, res) => {
    //cierra la sesión
    req.logOut();
   
    res.sendStatus(200)
});

module.exports = router;