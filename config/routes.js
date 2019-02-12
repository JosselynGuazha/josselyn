var express = require('express');
var router = express.Router();
var passport = require('passport');
/* GET home page. */
//controladores
var marca = require('../app/controllers/MarcaController');
var MarcaController = new marca();

var producto= require('../app/controllers/ProductoController');
var ProductoController = new producto();

var auth = function middleWare(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('err_cred', 'Inicia sesion!!!');
        res.redirect('/josselynStore/login');
    }
};

router.get('/josselynStore', function(req, res, next) {
  res.render('fragmentos/frm_areacenter', { title: 'Josselyn`s Store' });
});
router.get('/josselynStore/inicio', function(req, res, next) {
  res.render('fragmentos/frm_inicio', { title: 'Josselyn`s Store', rol : req.user.nombre });
});
router.get('/josselynStore/registro', function(req, res, next) {
  res.render('fragmentos/registro', { title: 'Josselyn`s Store' });
});
router.get('/josselynStore/login', function(req, res, next) {
  res.render('fragmentos/login', { title: 'Josselyn`s Store' , error: req.flash('err_cred')});
});



router.post('/iniciar_sesion',
        passport.authenticate('local-signin',
                {successRedirect: '/josselynStore/inicio',
                    failureRedirect: '/josselynStore/login',
                    failureFlash: true}
        ));

router.post('/josselynStore/registro/guardar',
        passport.authenticate('local-signup', {successRedirect: '/josselynStore/login',
            failureRedirect: '/josselynStore/registro', failureFlash: true}
        ));



 //marcas
router.get('/josselynStore/administrar/marca', MarcaController.verMarca);
router.post('/josselynStore/administrar/marca/guardar',MarcaController.guardar);
router.post('/josselynStore/administrar/marca/modificar',MarcaController.modificar);

//productos
router.get('/josselynStore/administrar/producto', auth, ProductoController.verProducto);
router.post('/josselynStore/administrar/producto/guardar',ProductoController.guardar);
router.post('/josselynStore/administrar/producto/modificar',ProductoController.modificar);

router.post('/josselynStore/administrar/producto/guardar_foto/:external', auth, ProductoController.guardarImagen);

module.exports = router;


