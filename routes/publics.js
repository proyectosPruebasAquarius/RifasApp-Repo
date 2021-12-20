const express = require('express');
const router = express.Router();
const pool = require('../config/db.config');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const dateFormat = require("dateformat");
const Cart = require("../config/cart");
const { isLoggedIn } = require('../config/auth');
router.get("/inicio", async(req, res) => {
    const publicaciones = await pool.query(`select b.nombre as producto,a.titulo,a.descripcion,a.contenido,a.fecha as fecha_publicacion, a.imagen from publicaciones as a inner join rifas as b on a.id_rifa=b.id`);
    const posts = await pool.query(`select a.*, b.nombre as rifas, c.precio as boleto from publicaciones as a inner join rifas as b on a.id_rifa = b.id inner join boletos as c on c.id_rifa = b.id`)
    var cart = !req.session.cart ? null : new Cart(req.session.cart);
    res.render("publics_views/index", {
        publicaciones: publicaciones,
        posts: posts,
        title: "Inicio - Bruji Rifas",
        activa: 'si',
        productos: !req.session.cart ? null : cart.generateArray(),
        totalPrice: !req.session.cart ? 0 : cart.totalPrice,
        usuario_mess: req.flash('usuario_mess')
    });
});
/*router.get("/inicio", async(req, res) => {
    const publicaciones = await pool.query(`select b.nombre as producto,a.titulo,a.descripcion,a.contenido,a.fecha as fecha_publicacion, a.imagen from publicaciones as a inner join rifas as b on a.id_rifa=b.id`);

    res.render("publics_views/index", { publicaciones: publicaciones, title: "Inicio - Bruji Rifas", activa: 'si' });
});*/

router.get("/about", function(req, res) {
    res.render("publics_views/about", { title: "Sobre Nosotros - Bruji Rifas", activa: 'si' });
});
router.get("/contacto", function(req, res) {
    res.render("publics_views/contact", { title: "Contacto - Bruji Rifas", activa: 'si' });
});
router.get("/participacion", function(req, res) {
    res.render("publics_views/participation", { title: "Como Participar - Bruji Rifas" });
});
router.get("/legal", function(req, res) {
    res.render("publics_views/legal", { title: "Información Legal - Bruji Rifas" });
});
router.get("/carrito", function(req, res) {
    res.render("publics_views/carts/cart", { title: "Carrito de Compras - Bruji Rifas" });
});
router.get("/checkout", function(req, res) {
    res.render("publics_views/carts/checkout", {
        title: "Verificación de Pago - Bruji Rifas",
        productos: req.app.locals.productos,
        totalPrice: req.app.locals.totalPrice
    });
});

module.exports = router;