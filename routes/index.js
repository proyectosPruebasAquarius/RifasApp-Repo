var express = require("express");
var router = express.Router();
const pool = require("../config/db.config");
const { isLoggedIn } = require('../config/auth');
const dateFormat = require("dateformat");
/* GET home page. */
router.get("/", isLoggedIn, async function(req, res, next) {
   
    const dailyDate = dateFormat(new Date(), "yyyy-mm-dd")
    const currentYear = dateFormat(new Date(), "yyyy")

    const dailySale = await pool.query("select sum(total) as total from ventas where DATE_FORMAT(fecha_pago,'%Y-%m-%d') =?", dailyDate);
    const anualSale = await pool.query("select sum(total) as total from ventas where DATE_FORMAT(fecha_pago,'%Y') =?", currentYear);
    const dailyUsers = await pool.query("select count(a.id) as usuario from usuarios as a inner join clientes as b on a.id_cliente=b.id where DATE_FORMAT(b.fecha_registro,'%Y-%m-%d') =?",dailyDate);
    const anualUser = await pool.query("select count(a.id) as usuario from usuarios as a inner join clientes as b on a.id_cliente=b.id where DATE_FORMAT(b.fecha_registro,'%Y') = ?",currentYear);
    const activeRifas = await pool.query("select count(a.id) as rifa from  publicaciones as a inner join rifas as b on a.id_rifa=b.id where estado = 1");
    const allRifas = await pool.query("select count(a.id) as rifa from  publicaciones as a inner join rifas as b on a.id_rifa=b.id ")
    const productStock = await pool.query("select a.nombre,b.stock,a.imagen from productos as a inner join inventarios as b on a.id=b.id_producto inner join proveedores as c on b.id_proveedor=c.id")
    const maxParticipation = await pool.query("select e.id, MAX(e.nombre)as nombre from ventas as a inner join detalle_venta as b on b.id_venta = a.id inner join boletos as c on b.id_boleto =c.id inner join rifas as e on c.id_rifa = e.id inner join publicaciones as f on e.id = f.id_rifa where f.estado = 1 ")
    const maxParticipationPerson = await pool.query("select count(a.id) as cuenta from clientes as a inner join usuarios as b on a.id=b.id_cliente inner join ventas as c on a.id=c.id_cliente inner join detalle_venta as e on c.id=e.id_venta inner join boletos as f on e.id_boleto=f.id inner join rifas as g on f.id_rifa =g.id where g.id =?", maxParticipation[0].id)
    const mostPopularCat= await pool.query("select h.id, MAX(h.nombre)as nombre from ventas as a inner join detalle_venta as b on b.id_venta = a.id inner join boletos as c on b.id_boleto =c.id inner join rifas as e on c.id_rifa = e.id inner join publicaciones as f on e.id = f.id_rifa inner join productos as g on e.id_producto=g.id inner join categorias as h on g.id_categoria=h.id where f.estado = 1")
    const mostPupularCatParticipation = await pool.query(`select count(a.id_cliente)as cuenta from ventas as a 
    inner join detalle_venta as b on b.id_venta = a.id 
    inner join boletos as c on b.id_boleto =c.id 
    inner join rifas as e on c.id_rifa = e.id 
    inner join publicaciones as f on e.id = f.id_rifa 
    inner join productos as g on e.id_producto=g.id 
    inner join categorias as h on g.id_categoria=h.id
    inner join clientes as i on a.id_cliente=i.id where f.estado = 1 and h.id = ?
    `, mostPopularCat[0].id)
    const bitacora = await pool.query("select concat(c.nombres,' ',c.apellidos) as empleado,c.foto,a.host,a.tabla,a.accion,a.fecha_registro from bitacora as a inner join empleados_laborales as b on a.id_empleado=b.id inner join empleados_personales as c on b.cod_empleado=c.cod_empleado");
    const lastSale = await pool.query("select b.id as id_cliente,concat(b.nombres,' ',b.apellidos)as cliente,a.forma_pago,a.total from ventas as a inner join clientes as b on a.id_cliente =b.id   order by a.id DESC limit 1");
    const mostSalePerson = await pool.query("select count(a.id_cliente) as compras,concat(b.nombres,' ',b.apellidos)as cliente from ventas as a inner join clientes as b on a.id_cliente =b.id where id_cliente =?",lastSale[0].id_cliente)
   // console.log({popular: mostSalePerson[0]});



    res.render("index", { 
        title: "Inicio - Bruji Rifas", 
        VentaDiaria: dailySale[0].total,
        VentaAnual: anualSale[0].total, 
        UsuarioDiario: dailyUsers[0].usuario,
        UsuarioAnual: anualUser[0].usuario,
        RifasActivas: activeRifas[0].rifa,
        AllRifas: allRifas[0].rifa,
        Productos: productStock,
        maxParticipation: maxParticipation[0].nombre,
        maxPerson:maxParticipationPerson[0].cuenta,
        popular: mostPopularCat[0].nombre,
        maxPersonPopular: mostPupularCatParticipation[0].cuenta,
        bitacora:bitacora,
        lastSale:lastSale[0],
        mostSalePerson:mostSalePerson[0]
        });

});

module.exports = router;
