const express = require("express");
const router = express.Router();
const pool = require("../config/db.config");
const { check, validationResult } = require('express-validator');

const { isLoggedIn, isNotLoggedIn } = require("../config/auth");

const passport = require("passport");


router.get("/signup", isNotLoggedIn, (req, res) => {

    res.render("auth/signup", { title: "Registro de Usuarios - Bruji Rifas" });
});


router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/inicio',
    failureRedirect: '/inicio ',
    failureFlash: true
}));



/*router.post('/signup', function(req, res, next) {
    const url = req.body.url;



    passport.authenticate('local.signup', function(err, user) {
        if (err) { return next(err); }

        if (url == '/carrito') {
            return res.redirect('/carrito');
        } else {

            return res.redirect();
        }


    })(req, res, next);
})*/





// SINGIN
router.get('/login', isNotLoggedIn, (req, res) => {
    res.render("auth/login", { title: "Login - Bruji Rifas" });
});


router.post('/login', isNotLoggedIn, function(req, res, next) {
    const url = req.body.url;
    passport.authenticate('local.login', function(err, user, message) {
        if (err) { return next(err); }
        const mensajes = message.message;
        if (mensajes === 'USER DEACTIVATED') {
            req.flash('usuario_mess', 'user-deleted');
            res.redirect('/inicio');
        } else {
            req.logIn(user, function(err) {
                if (err) { return next(err); }

                if (user.estado === 0) {
                    res.redirect('/logout')
                } else {
                    if (url == '/carrito') {
                        return res.redirect('/carrito');
                    } else {
                        let state = user.id_tipo_usuario == 3 ? '/inicio' : '/'
                        return res.redirect(state);

                    }
                }


            });
        }

    })(req, res, next);
})

router.get('/logout', (req, res) => {
    //cierra la sesión
    req.logOut();
    res.redirect('/inicio');
});


module.exports = router;