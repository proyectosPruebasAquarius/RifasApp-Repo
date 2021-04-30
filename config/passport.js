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
    const { id_empleado } = req.body;
    const newUser = {
        username,
        password,
        id_empleado
    };
    newUser.password = await helpers.encryptPassword(password);
    
    const result = await pool.query('insert into usuarios_admin set ?', [newUser]);

    console.log(result);


}));

//passport.serializeUser((usr, done) => {

//})