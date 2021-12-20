module.exports = {
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            if (req.user.id_tipo_usuario == 3) {
                return res.redirect('/inicio');
            } else {
                return next();

            }


        }
        return res.redirect('/inicio');
    },
    masterRutes(req, res, next) {
        if (req.isAuthenticated()) {
            if (req.user.id_tipo_usuario == 2 || req.user.id_tipo_usuario == 3) {
                return res.redirect('/');
            } else {
                return next();

            }


        }
        return res.redirect('/');
           
    },
    


    isNotLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/inicio');
    }


};