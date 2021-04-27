const express = require('express');
const router = express.Router();

router.get('signup/', (req, res) =>{
    res.render('auth/signup', { title: "Agregar Usuarios - Bruji Rifas" });
});


module.exports = router;
