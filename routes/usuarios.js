var express = require("express");
var router = express.Router();
const helpers = require("../config/helpers");
const passport = require("passport");
const pool = require("../config/db.config");

const { isLoggedIn, isNotLoggedIn,masterRutes } = require("../config/auth");

/* GET users listing. */
router.get("/",masterRutes,async function(req, res, next) {
    const usuarios = await pool.query("select A.id, E.nombre as rol,A.estado, A.nombre as nombre_usuario,concat(D.nombres,' ',D.apellidos) as nombre,C.nombre as cargo from usuarios as A inner join empleados_laborales as B on A.id_empleado = B.id inner join cargos as C on B.id_cargo = C.id  inner join empleados_personales as D  on B.cod_empleado=D.cod_empleado inner join tipos_usuarios as E on A.id_tipo_usuario=E.id")
    console.log(usuarios);
    res.render("usuarios/list", { title: "Usuarios Administrativos - Brujirifas",usuarios:usuarios });
});


/*router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/',
    failureRedirect: 'usuarios/',
    failureFlash: true
}));*/
router.get("/add",masterRutes, function(req, res, next) {
    res.render("usuarios/add", { title: "Agregar Usuario - Brujirifas" });
});

router.get("/listEmpleados",async function(req,res,next){
   // const ListaEmpelados = await pool.query("select b.id, concat(a.cod_empleado,'-',a.nombres,' ',a.apellidos) as text from empleados_personales as a inner join empleados_laborales as b on a.cod_empleado= b.cod_empleado")
    const nombre = req.query.q;
    const ListaEmpelados = nombre != null && nombre != "" ? await 
    pool.query("select b.id, concat(a.cod_empleado,'-',a.nombres,' ',a.apellidos) as text from empleados_personales as a inner join empleados_laborales as b on a.cod_empleado= b.cod_empleado where concat(a.cod_empleado,'-',a.nombres,' ',a.apellidos) like '%" + nombre + "%'") : 
    await 
    pool.query("select b.id, concat(a.cod_empleado,'-',a.nombres,' ',a.apellidos) as text from empleados_personales as a inner join empleados_laborales as b on a.cod_empleado= b.cod_empleado");
    res.send(ListaEmpelados);
});
router.get("/listTipos",async function(req,res,next){
    // const ListaEmpelados = await pool.query("select b.id, concat(a.cod_empleado,'-',a.nombres,' ',a.apellidos) as text from empleados_personales as a inner join empleados_laborales as b on a.cod_empleado= b.cod_empleado")
     const nombre = req.query.q;
     const ListaEmpelados = nombre != null && nombre != "" ? await 
     pool.query("select id,nombre as text from tipos_usuarios where nombre like '%" + nombre + "%'") : 
     await 
     pool.query("select id,nombre as text from tipos_usuarios");
     res.send(ListaEmpelados);
 });

 router.post('/administrador', async(req, res) => {
    

    const {

        nombre,
        id_tipo_usuario,
        id_empleado,
        password

    } = req.body;
    const estado = 1;
    let encryptPass = password;
    encryptPass = await helpers.encryptPassword(encryptPass);
    let newUser={
        nombre,
        id_tipo_usuario,
        id_empleado,
        password,
        estado
    }
    newUser.password = encryptPass;
    console.log({newUser:newUser});
    
   await pool.query("insert into usuarios set ?", [newUser], (error, success) => {
        if (!error) {
            req.flash('message', 'Guardado con éxito')
            res.redirect('/usuarios');
        } else {
            req.flash('message', 'Ocurrió un error inesperado')
            res.redirect('/usuarios');
        }
    });


});


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