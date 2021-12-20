const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require("./db.config");
const helpers = require("./helpers");

passport.use('local.login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, username, password, done) => {
    const rows = await pool.query('SELECT * FROM usuarios WHERE nombre = ?', [username]);
    const user = rows[0];
    if (user.estado === 0) {
        return done(null, false, { message: "USER DEACTIVATED" });
    } else {
        if (rows.length > 0) {

            const validPassword = await helpers.matchPassword(password, user.password);
            //se agrego los mensajes para enviarlos como api
            if (validPassword) {
                //done(null, user, req.flash('success', 'Welcome ' + user.username));
                done(null, user, { message: "USER SUCCESS" });
            } else {
                done(null, false, { message: "PASSWORD INCORRECT" });
            }
        } else {

            return done(null, false, { message: "DONT EXIST USERNAME" });
        }
    }



}));

//función para registrar
passport.use('local.signup', new LocalStrategy({
    usernameField: 'nombre',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, nombre, password, done) => {

    const id_tipo_usuario = 1;
    const estado = 1;
    let newUser = {
        nombre,
        password,
        id_tipo_usuario,
        estado
    };
    //encripta la contraseña
    newUser.password = await helpers.encryptPassword(password);
    // Saving in the Database
    const result = await pool.query('INSERT INTO usuarios SET ? ', newUser);
    newUser.id = result.insertId;
    return done(null, newUser);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
    const rows = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    done(null, rows[0]);
});