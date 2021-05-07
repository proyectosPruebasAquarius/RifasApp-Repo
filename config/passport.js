const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require("./db.config");
const helpers = require("./helpers");

passport.use('local.login', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  const rows = await pool.query('SELECT * FROM usuarios_admin WHERE username = ?', [username]);
  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await helpers.matchPassword(password, user.password)
    if (validPassword) {
      //done(null, user, req.flash('success', 'Welcome ' + user.username));
      done(null, user);
    } else {
      done(null, false, req.flash('errors', 'Incorrect Password'));
    }
  } else {
    return done(null, false, req.flash('errors', 'The Username does not exists.'));
  }
}));

//función para registrar
  passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, username, password, done) => {
  
    const cod_empleado = "SA01";
    const estado = 1;
    let newUser = {      
      username,
      password,
      cod_empleado,
      estado
    };
    //encripta la contraseña
    newUser.password = await helpers.encryptPassword(password);
    // Saving in the Database
    const result = await pool.query('INSERT INTO usuarios_admin SET ? ', newUser);
    newUser.id = result.insertId;
    return done(null, newUser);
  }));
  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM usuarios_admin WHERE id = ?', [id]);
    done(null, rows[0]);
  });