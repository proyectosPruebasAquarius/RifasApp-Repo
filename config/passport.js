const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const pool = require("./db.config");
const helpers = require("./helpers");

passport.use('local.signup', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    //await
    const  id_empleado  = 1;
    const estado = 1;
    const newUser = {
        username,
        password,
        id_empleado,
        estado
    };
    //newUser.password = await helpers.encryptPassword(password);
    console.log(newUser);
    const result = await pool.query('insert into usuarios_admin set ?', [newUser]);
    newUser.id = result.insertId
    return done(null, newUser);
}));

passport.serializeUser((user, done) => {
   done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
    const rows = await pool.query('select * from usuarios_admin where id = ?', id);
    done(null, rows[0]);
})