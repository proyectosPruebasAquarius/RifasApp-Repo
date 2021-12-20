const express = require("express");
const router = express.Router();
const dateFormat = require("dateformat");
const pool = require("../config/db.config");
const multer = require('multer');
const fs = require("fs");
const path = require('path');
const { isLoggedIn,masterRutes } = require('../config/auth');
// Función para renombrar imagen
const storage = multer.diskStorage({

    destination: path.join(__dirname, '../public/images/empleados'),

    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const imgSave = (multer({
    storage,
    dest: path.join(__dirname, '../public/images/empleados'),
    fileFilter: function(req, file, cb) {

        var filetypes = /jpeg|jpg|png|gif/;
        var mimetype = filetypes.test(file.mimetype);
        var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb("Error: File upload only supports the following filetypes - " + filetypes);
    },
    limits: {
        fileSize: 1000000
    },
}));

//ruta para listar empleados/list 
router.get("/",isLoggedIn,masterRutes, async(req, res) => {
    const empleados = await pool.query("select a.*,b.id as id_laboral, b.id_cargo, b.NIT, b.seguro_social, b.cuenta_bancaria, b.AFP, b.fecha_registro, b.fecha_baja, b.id_contrato, b.jefe_inmediato, f.nombre as cod_sucursal, b.estado, c.nombre as cargo,  concat(d.nombre,' - hrs: ', d.num_horas) as contrato, e.nombre as municipio from empleados_personales as a INNER JOIN empleados_laborales as b on  a.cod_empleado = b.cod_empleado INNER JOIN cargos as c on b.id_cargo = c.id INNER JOIN contratos as d on b.id_contrato = d.id INNER JOIN municipios as e on a.id_municipio = e.id inner join sucursales as f on b.id_sucursal=f.id");
    res.render("empleados/list", {
        empleados: empleados,
        title: "Lista Empleados - Bruji Rifas",
        message: req.flash('message')
    });
});

//ADD EMPLEADOS INICIA

router.get("/add",isLoggedIn,masterRutes, (req, res) => {
    res.render("empleados/add", {
        title: "Alta Empleado"
    });
});

/*router.get('/rios', (req, res) => {
        res.render('empleados/blank', {
            title: 'hello'
        })
    })*/
    //ruta para guardar los empleados_personales
router.post("/add",isLoggedIn,masterRutes, async(req, res) => {
    const {

        nombres,
        apellidos,
        DUI,
        correo,
        celular,
        fecha_nac,
        telefono,
        direccion,
        id_municipio,
        genero,
        estado_civil

    } = req.body;

    const letra = apellidos.charAt(0);


    const numero = await pool.query("SELECT COUNT(`cod_empleado`) as numero FROM empleados_personales where cod_empleado like " + "'" + letra + "%'");
    const num = parseInt(numero[0].numero) + 1;

    var cod_empleado = 0;
    if (num <= 9) {
        cod_empleado = letra + '00' + num;
    } else if (num > 9) {
        cod_empleado = letra + '0' + num;
    }

    var foto = cod_empleado + ".jpg";

    console.log("Primer letra del Primemer Apellidos " + letra + " numero: " + num + " cod_empleado " + cod_empleado);



    const newEmpleado = {
        cod_empleado,
        foto,
        nombres,
        apellidos,
        DUI,
        correo,
        celular,
        fecha_nac,
        telefono,
        direccion,
        id_municipio,
        genero,
        estado_civil
    };
    await pool.query("insert into empleados_personales set ?", [newEmpleado]);
    const success = req.flash('success', 'Registro Guardado correctamente!');


    const empleado = await pool.query("select * from empleados_personales where cod_empleado = ?", cod_empleado);
    res.render("empleados/add", {
        empleado: empleado[0]
    });

});



//ruta para buscar 
router.get("/search", async(req, res) => {
    const palabra = req.query.search;
    const empleados = await pool.query("select * from empleados_personales where concat(cod_empleado,nombres,apellidos) like '%" + palabra + "%'");
    res.render("empleados/edit", {
        empleados: empleados
    });
});

//ruta para guardar los empleados_laborales



router.post("/add_laborales", isLoggedIn,masterRutes,async(req, res) => {
    const {
        cod_empleado,
        id_cargo,
        NIT,
        seguro_social,
        cuenta_bancaria,
        AFP,
        fecha_registro,
        fecha_baja,
        id_contrato,
        jefe_inmediato,
        cod_sucursal,
        estado

    } = req.body;
    const newEmpleadoLab = {
        cod_empleado,
        id_cargo,
        NIT,
        seguro_social,
        cuenta_bancaria,
        AFP,
        fecha_registro,
        fecha_baja,
        id_contrato,
        jefe_inmediato,
        cod_sucursal,
        estado
    };
    await pool.query("insert into empleados_laborales set ?", [newEmpleadoLab]);
    const success = req.flash('success', 'Registro Guardado correctamente!');
    res.redirect("/empleados/add");
});
// FIN DE ADD EMPLEADOS

/* 
  #Rutas para axios
*/
// Ruta de busqueda para axios
router.get('/busqueda/:param', async(req, res) => {
    const param = req.params.param
    const datos = await pool.query("select a.*,b.id as id_laboral, b.id_cargo, b.NIT, b.seguro_social, b.cuenta_bancaria, b.AFP, b.fecha_registro, b.fecha_baja, b.id_contrato, b.jefe_inmediato, b.cod_sucursal, b.estado, c.nombre as cargo,  concat(d.nombre,' - hrs: ', d.num_horas) as contrato, e.nombre as municipio from empleados_personales as a INNER JOIN empleados_laborales as b on  a.cod_empleado = b.cod_empleado INNER JOIN cargos as c on b.id_cargo = c.id INNER JOIN contratos as d on b.id_contrato = d.id INNER JOIN municipios as e on a.id_municipio = e.id where concat(a.cod_empleado,a.nombres,a.apellidos) like '%" + param + "%'");
    res.send(datos);
})

router.get("/edit/all",isLoggedIn,masterRutes, async(req, res) => {
    const empleados = await pool.query("select a.*,b.id as id_laboral, b.id_cargo, b.NIT, b.seguro_social, b.cuenta_bancaria, b.AFP, b.fecha_registro, b.fecha_baja, b.id_contrato, b.jefe_inmediato, f.nombre as cod_sucursal, b.estado, c.nombre as cargo,  concat(d.nombre,' - hrs: ', d.num_horas) as contrato, e.nombre as municipio from empleados_personales as a INNER JOIN empleados_laborales as b on  a.cod_empleado = b.cod_empleado INNER JOIN cargos as c on b.id_cargo = c.id INNER JOIN contratos as d on b.id_contrato = d.id INNER JOIN municipios as e on a.id_municipio = e.id inner join sucursales as f on b.id_sucursal=f.id");
    // res.render("empleados/edit", { empleados: empleados, title: "Empleados Edit - Bruji Rifas" });
    res.send(empleados)
})

// Transaccion
router.post('/trasaccion', isLoggedIn,masterRutes,imgSave.single('foto'), async(req, res) => {
    // var members = req.body.members;
    const {

        nombres,
        apellidos,
        DUI,
        correo,
        celular,
        fecha_nac,
        telefono,
        direccion,
        id_municipio,
        genero,
        estado_civil

    } = req.body;

    const letra = apellidos.charAt(0);


    const numero = await pool.query("SELECT COUNT(`cod_empleado`) as numero FROM empleados_personales where cod_empleado like " + "'" + letra + "%'");
    const num = parseInt(numero[0].numero) + 1;

    var cod_empleado = 0;
    if (num <= 9) {
        cod_empleado = letra + '00' + num;
    } else if (num > 9) {
        cod_empleado = letra + '0' + num;
    }
    // console.log(req.file)
    var fotoOriginalName = req.file.filename;
    const ext = fotoOriginalName.split('.').pop();
    //const newPathToFile = path.join(__dirname, '../public/images/empleados/'+cod_empleado+'.'+ext)
    var foto = cod_empleado + '.' + ext;

    console.log("Primer letra del Primemer Apellidos " + letra + " numero: " + num + " cod_empleado " + cod_empleado);

    pool.getConnection(function(err, connection) {
        connection.beginTransaction(function(err) {
            if (err) { //Transaction Error (Rollback and release connection)
                connection.rollback(function() {
                    connection.release();
                    //Failure
                });
            } else {




                const newEmpleado = {
                    cod_empleado,
                    foto,
                    nombres,
                    apellidos,
                    DUI,
                    correo,
                    celular,
                    fecha_nac,
                    telefono,
                    direccion,
                    id_municipio,
                    genero,
                    estado_civil
                };
                console.log(newEmpleado)
                connection.query("insert into empleados_personales set ?", [newEmpleado], function(err, results) {
                    console.log(results, err)
                    const {
                        //cod_empleado,
                        id_cargo,
                        NIT,
                        seguro_social,
                        cuenta_bancaria,
                        AFP,
                        fecha_registro,
                        fecha_baja,
                        id_contrato,
                        jefe_inmediato,
                        id_sucursal,
                        estado

                    } = req.body;
                    //const cod_empleado = 's002';
                    console.log(cod_empleado)
                    const newEmpleadoLab = {
                        cod_empleado,
                        id_cargo,
                        NIT,
                        seguro_social,
                        cuenta_bancaria,
                        AFP,
                        fecha_registro,
                        fecha_baja,
                        id_contrato,
                        jefe_inmediato,
                        id_sucursal,
                        estado
                    };
                    console.log(newEmpleadoLab)
                    connection.query("insert into empleados_laborales set ?", [newEmpleadoLab]);
                    if (err) { //Query Error (Rollback and release connection)
                        connection.rollback(function() {
                            connection.release();
                            req.flash('message', 'Ocurriò un error inesperado')
                            res.redirect('/empleados')
                        });
                    } else {
                        connection.commit(function(err) {
                            if (err) {
                                connection.rollback(function() {
                                    connection.release();
                                    //Failure
                                });
                            } else {
                                connection.release();
                                //Success
                                // res.send('')
                                req.flash('message', 'Guardado con exito')
                                res.redirect('/empleados')
                                const pathToFile = path.join(__dirname, '../public/images/empleados/' + fotoOriginalName)
                                    // const ext = foto.split('.').pop();
                                const newPathToFile = path.join(__dirname, '../public/images/empleados/' + foto)

                                fs.rename(pathToFile, newPathToFile, function(err) {
                                    if (err) {
                                        throw err
                                    } else {
                                        console.log("Successfully renamed the file!")
                                    }
                                })
                            }
                        });
                    }
                });
            }
        });
    });
})

// Update
router.post('/transaccion/update/:cod_empleado',isLoggedIn,masterRutes, (req, res) => {
    const cod_empleado = req.params.cod_empleado;
    const {
        nombres,
        apellidos,
        DUI,
        correo,
        celular,
        fecha_nac,
        telefono,
        direccion,
        id_municipio,
        genero,
        estado_civil
    } = req.body;

    pool.getConnection(function(err, connection) {
        connection.beginTransaction(function(err) {
            if (err) { //Transaction Error (Rollback and release connection)
                connection.rollback(function() {
                    connection.release();
                    //Failure
                });
            } else {




                const newEmpleado = {
                    //cod_empleado,
                    // foto,
                    nombres,
                    apellidos,
                    DUI,
                    correo,
                    celular,
                    fecha_nac,
                    telefono,
                    direccion,
                    id_municipio,
                    genero,
                    estado_civil
                };
                console.log(newEmpleado)
                    //await pool.query("update empleados_personales set ? where cod_empleado = ?", [newEmpleadoPer, cod_empleado]);
                connection.query("update empleados_personales set ? where cod_empleado = ?", [newEmpleado, cod_empleado], function(err, results) {
                    console.log(results, err)
                    const {
                        //cod_empleado,
                        id_cargo,
                        NIT,
                        seguro_social,
                        cuenta_bancaria,
                        AFP,
                        fecha_registro,
                        fecha_baja,
                        id_contrato,
                        jefe_inmediato,
                        id_sucursal,
                        estado

                    } = req.body;
                    //const cod_empleado = 's002';
                    console.log(cod_empleado)
                    const newEmpleadoLab = {
                        //cod_empleado,
                        id_cargo,
                        NIT,
                        seguro_social,
                        cuenta_bancaria,
                        AFP,
                        fecha_registro,
                        fecha_baja,
                        id_contrato,
                        jefe_inmediato,
                        id_sucursal,
                        estado
                    };
                    console.log(newEmpleadoLab)
                    connection.query("update empleados_laborales set ? where cod_empleado = ?", [newEmpleadoLab, cod_empleado]);
                    if (err) { //Query Error (Rollback and release connection)
                        connection.rollback(function() {
                            connection.release();
                            //Failure
                            req.flash('message', 'Ocurriò un error inesperado')
                            res.redirect('/empleados')
                        });
                    } else {
                        connection.commit(function(err) {
                            if (err) {
                                connection.rollback(function() {
                                    connection.release();
                                    //Failure
                                });
                            } else {
                                connection.release();
                                //Success
                                // res.send('')
                                //res.redirect('back')
                                req.flash('message', 'Actualizado con exito')
                                res.redirect('/empleados')
                                    // const pathToFile = path.join(__dirname, '../public/images/empleados/' + fotoOriginalName)
                                    // const ext = foto.split('.').pop();
                                    //const newPathToFile = path.join(__dirname, '../public/images/empleados/' + foto)


                            }
                        });
                    }
                });
            }
        });
    });
})

//EMPIEZA BASE DE DATOS   empleados_personal

//ruta para listar empleados/edit 

router.get("/edit/:cod_empleado",isLoggedIn,masterRutes, async(req, res) => {
    const cod_empleado = req.params.cod_empleado;
    const empleados = await pool.query("select a.*,b.id as id_laboral, b.id_cargo, b.NIT, b.seguro_social, b.cuenta_bancaria, b.AFP, b.fecha_registro, b.fecha_baja, b.id_contrato, b.jefe_inmediato, f.id as id_sucursal, f.nombre as cod_sucursal, b.estado, c.nombre as cargo,  concat(d.nombre,' - hrs: ', d.num_horas) as contrato, e.nombre as municipio from empleados_personales as a INNER JOIN empleados_laborales as b on  a.cod_empleado = b.cod_empleado INNER JOIN cargos as c on b.id_cargo = c.id INNER JOIN contratos as d on b.id_contrato = d.id INNER JOIN municipios as e on a.id_municipio = e.id INNER JOIN sucursales as f on b.id_sucursal = f.id where b.cod_empleado = ?", cod_empleado);
    res.render("empleados/edit", {
        empleados: empleados[0],
        title: "Empleados Edit - Bruji Rifas"
    });
    //res.send(empleados)
})

//ruta que recibe el cod_empleado para llenar el formulario o la vista edit_personal
router.get("/edit_personal/:cod_empleado",isLoggedIn,masterRutes, async(req, res) => {
    const empleados = await pool.query("select * from empleados_personales");
    const cod_empleado = req.params.cod_empleado;
    //const empleado = await pool.query("select * from empleados_personales where id = ?", cod_empleado );
    const empleado_lab = await pool.query("select a.*,b.id as id_laboral, b.id_cargo, b.NIT, b.seguro_social, b.cuenta_bancaria, b.AFP, b.fecha_registro, b.fecha_baja, b.id_contrato, b.jefe_inmediato, b.cod_sucursal, b.estado from empleados_personales as a INNER JOIN empleados_laborales as b on  a.cod_empleado = b.cod_empleado where b.cod_empleado = ?", cod_empleado);
    console.log(empleado_lab)
    res.render("empleados/edit", {
        empleado_lab: empleado_lab[0],
        empleados: empleados,
        title: "Editar Empleado - Bruji Rifas",
    });
});

//ruta que recibe el cod_empleado  para actualizar en la base de datos empleados_personal
router.post("/edit_personal/:cod_empleado",isLoggedIn,masterRutes, async(req, res) => {
    const cod_empleado = req.params.cod_empleado;
    const {
        foto,
        nombres,
        apellidos,
        DUI,
        correo,
        celular,
        fecha_nac,
        telefono,
        direccion,
        id_municipio,
        genero,
        estado_civil
    } = req.body;
    const newEmpleadoPer = {
        foto,
        nombres,
        apellidos,
        DUI,
        correo,
        celular,
        fecha_nac,
        telefono,
        direccion,
        id_municipio,
        genero,
        estado_civil
    };
    await pool.query("update empleados_personales set ? where cod_empleado = ?", [newEmpleadoPer, cod_empleado]);
    const success = req.flash('success', 'Registro actualizado correctamente!');
    res.redirect("/empleados/edit_personal/" + cod_empleado);
});
//FINALIZA BASE DE DATOS   empleados_personal



//EMPIEZA BASE DE DATOS   empleados_laboral
//ruta que recibe el cod_empleado para llenar el formulario o la vista edit_laboral
/*router.get("/edit_laboral/:cod_empleado", async (req, res) => {
   const empleados = await pool.query("SELECT * FROM empleados_personales");
  const cod_empleado = req.params.cod_empleado;
   const empleado = await pool.query("select * FROM empleados_laborales where cod_empleado = ?",
    cod_empleado );
   res.render("empleados/edit", {
    empleado: empleado[0], empleados:empleados, title: "Editar Empleado - Bruji Rifas",
  });
  
});*/

//ruta que recibe el cod_empleado  para actualizar en la base de datos empleados_laboral
router.post("/edit_laboral/:cod_empleado",isLoggedIn,masterRutes, async(req, res) => {
    const cod_empleado = req.params.cod_empleado;
    const {
        id_cargo,
        NIT,
        seguro_social,
        cuenta_bancaria,
        AFP,
        fecha_registro,
        fecha_baja,
        id_contrato,
        Jefe_inmediato,
        cod_sucursal,
        estado
    } = req.body;
    const newEmpleadoPer = {
        id_cargo,
        NIT,
        seguro_social,
        cuenta_bancaria,
        AFP,
        fecha_registro,
        fecha_baja,
        id_contrato,
        Jefe_inmediato,
        cod_sucursal,
        estado
    };
    await pool.query("update empleados_laborales set ? where cod_empleado = ?", [newEmpleadoPer, cod_empleado]);
    const success = req.flash('success', 'Actualizado correctamente!');
    res.redirect("/empleados/edit_laboral/" + cod_empleado);
});

// API para modal Card
router.get('/tracklist/:cod_empleado', async(req, res) => {
    const cod_empleado = req.params.cod_empleado;
    const empleados = await pool.query("select a.*,b.id as id_laboral, b.id_cargo, b.NIT, b.seguro_social, b.cuenta_bancaria, b.AFP, b.fecha_registro, b.fecha_baja, b.id_contrato, b.jefe_inmediato, b.cod_sucursal, b.estado, c.nombre as cargo,  concat(d.nombre,' - hrs: ', d.num_horas) as contrato, e.nombre as municipio from empleados_personales as a INNER JOIN empleados_laborales as b on  a.cod_empleado = b.cod_empleado INNER JOIN cargos as c on b.id_cargo = c.id INNER JOIN contratos as d on b.id_contrato = d.id INNER JOIN municipios as e on a.id_municipio = e.id where b.cod_empleado = ?", cod_empleado);
    res.send(empleados);
});

// Empleados perfil Info
router.get("/perfil/:id",isLoggedIn,masterRutes, async(req, res) => {
    const cod_empleado = req.params.id;
    const empleados = await pool.query("select a.*,b.id as id_laboral, b.id_cargo, b.NIT, b.seguro_social, b.cuenta_bancaria, b.AFP, b.fecha_registro, b.fecha_baja, b.id_contrato, b.jefe_inmediato, f.nombre as cod_sucursal, b.estado, c.nombre as cargo,  concat(d.nombre,' - hrs: ', d.num_horas) as contrato, e.nombre as municipio from empleados_personales as a INNER JOIN empleados_laborales as b on  a.cod_empleado = b.cod_empleado INNER JOIN cargos as c on b.id_cargo = c.id INNER JOIN contratos as d on b.id_contrato = d.id INNER JOIN municipios as e on a.id_municipio = e.id INNER JOIN sucursales as f on b.id_sucursal = f.id where b.cod_empleado = ?", cod_empleado);
    // const empleados = await pool.query('SELECT a.*, g.nombre as tipo, m.nombre as motivo, b.cod_empleado, e.nombre AS municipio, b.foto, b.nombres, b.apellidos, b.DUI, b.correo, b.celular, b.fecha_nac, b.telefono, b.direccion, b.genero, b.estado_civil, d.nombre AS cargo, c.NIT, c.seguro_social,c.cuenta_bancaria, c.AFP, c.fecha_registro, c.fecha_baja, f.nombre as contrato, c.jefe_inmediato, c.cod_sucursal, c.estado  FROM ausencias AS a INNER JOIN empleados_personales AS b ON a.id_empleado = b.id INNER JOIN empleados_laborales AS c ON c.cod_empleado = b.cod_empleado INNER JOIN cargos AS d ON c.id_cargo = d.id INNER JOIN contratos as f ON c.id_contrato = f.id INNER JOIN municipios as e ON b.id_municipio = e.id LEFT JOIN tipos_incapacidades as g ON a.id_tipo_ausencia = g.id LEFT JOIN motivos_ausencias as m ON a.id_motivo_ausencia = m.id WHERE a.id_empleado = ?',cod_empleado);
    //console.log(empleados)
    res.render("empleados/perfilEmpleado", {
        empleados: empleados[0],
        title: "Empleados Edit - Bruji Rifas"
    });
    //res.send(empleados)
})

/* 
  ### AUSENCIAS SECTION
*/

// LIST AUSENCIAS
router.get('/ausencias',isLoggedIn,masterRutes, async(req, res) => {
    const ausencias = await pool.query('select a.*, concat(b.nombres," ", b.apellidos) as empleado from ausencias as a INNER JOIN empleados_personales as b on a.id_empleado = b.id');
    res.render("empleados/ausenciasList", {
        ausencias: ausencias,
        title: "Lista de Ausencias - Bruji Rifas",
        message: req.flash('message')
    });
})

// API para modal Card
/*router.get('/tracklist/:cod_empleado' , async (req, res) => {
  const cod_empleado = req.params.cod_empleado;
  const empleados = await pool.query("select a.* from empleados_personales where b.cod_empleado = ?", cod_empleado);
  res.send(empleados);
});*/

// List for modal
router.get('/ausencias/:id', async(req, res) => {
    const codigo = req.params.id;
    //const ausencias = await pool.query('select a.*, concat(b.nombres," ", b.apellidos) as empleado, b.foto, b.cod_empleado, b.id as idEmpleado, c.nombre as tipo_incapacidad, d.nombre as motivo_ausencia from ausencias as a INNER JOIN empleados_personales as b on a.id_empleado = b.id INNER JOIN tipos_incapacidades as c on a.id_tipo_ausencia = c.id INNER JOIN motivos_ausencias as d on a.id_motivo_ausencia = d.id where a.id_empleado = ?', codigo);
    const ausencias = await pool.query('select a.*, concat(b.nombres," ", b.apellidos) as empleado, b.foto, b.cod_empleado, b.id as idEmpleado, c.nombre as tipo_incapacidad, d.nombre as motivo_ausencia from ausencias as a INNER JOIN empleados_personales as b on a.id_empleado = b.id LEFT JOIN tipos_incapacidades as c on a.id_tipo_ausencia = c.id LEFT JOIN motivos_ausencias as d on a.id_motivo_ausencia = d.id where a.id_empleado = ? ORDER BY a.fecha_fin ASC', codigo);
    var notNull = ausencias.length > 0 ? ausencias : await pool.query('select *, concat(nombres," ", apellidos) as empleado from empleados_personales where id = ?', codigo);
    res.send(notNull);
})

router.post("/ausencias/add",isLoggedIn,masterRutes, async(req, res) => {
    const {
        fecha_inicio,
        fecha_fin,
        descripcion,
        id_tipo_ausencia,
        id_motivo_ausencia,
        id_empleado
    } = req.body

    const newAusencia = {
        fecha_inicio,
        fecha_fin,
        descripcion,
        id_tipo_ausencia,
        id_motivo_ausencia,
        id_empleado
    }

    await pool.query("insert into ausencias set ?", [newAusencia]);
    res.redirect('/empleados/')
});

// List for values in modal
router.get('/ausencias/values/:id', async(req, res) => {
    const codigo = req.params.id;
    //const ausencias = await pool.query('select a.*, concat(b.nombres," ", b.apellidos) as empleado, b.foto, b.cod_empleado, b.id as idEmpleado, c.nombre as tipo_incapacidad, d.nombre as motivo_ausencia from ausencias as a INNER JOIN empleados_personales as b on a.id_empleado = b.id INNER JOIN tipos_incapacidades as c on a.id_tipo_ausencia = c.id INNER JOIN motivos_ausencias as d on a.id_motivo_ausencia = d.id where a.id_empleado = ?', codigo);
    const ausencias = await pool.query('SELECT a.*, b.nombre AS textTipo FROM ausencias AS a INNER JOIN tipos_incapacidades AS b ON a.id_tipo_ausencia = b.id WHERE a.id = ?', codigo);
    var isNull = ausencias.length > 0 ? ausencias : await pool.query('SELECT a.*, b.nombre AS textMotivo FROM ausencias AS a INNER JOIN motivos_ausencias AS b ON a.id_motivo_ausencia = b.id WHERE a.id = ?', codigo);
    res.send(isNull);
})

router.post('/ausencias/values/:id',isLoggedIn,masterRutes, async(req, res) => {
    const codigo = req.params.id;
    const {
        fecha_inicio,
        fecha_fin,
        descripcion,
        id_tipo_ausencia,
        id_motivo_ausencia,
        id_empleado
    } = req.body

    const newAusencia = {
            fecha_inicio,
            fecha_fin,
            descripcion,
            id_tipo_ausencia,
            id_motivo_ausencia,
            id_empleado
        }
        //const ausencias = await pool.query('select a.*, concat(b.nombres," ", b.apellidos) as empleado, b.foto, b.cod_empleado, b.id as idEmpleado, c.nombre as tipo_incapacidad, d.nombre as motivo_ausencia from ausencias as a INNER JOIN empleados_personales as b on a.id_empleado = b.id INNER JOIN tipos_incapacidades as c on a.id_tipo_ausencia = c.id INNER JOIN motivos_ausencias as d on a.id_motivo_ausencia = d.id where a.id_empleado = ?', codigo);
    const ausencias = await pool.query('update ausencias set ? where id = ?', [newAusencia, codigo]);
    res.redirect('/empleados/')
})


// Elimina ausencia per id
router.get("/ausencias/delete/:id",isLoggedIn,masterRutes, async(req, res) => {
    const id = req.params.id;
    console.log(id)
    await pool.query('delete from ausencias where id = ?', id);
    const success = req.flash('success', 'Eliminado correctamente!');
    res.redirect("/empleados/");
});
//FINALIZA BASE DE DATOS   empleados_personal
module.exports = router;