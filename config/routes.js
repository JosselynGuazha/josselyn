var express = require('express');
var router = express.Router();
var passport = require('passport');
/* GET home page. */
//controladores
var marca = require('../app/controllers/MarcaController');
var MarcaController = new marca();

var producto= require('../app/controllers/ProductoController');
var ProductoController = new producto();

var carro = require('../app/controllers/CarritoController');
var carritoController = new carro();

var venta = require('../app/controllers/VentaController');
var ventaController = new venta();

var direccion = require('../app/controllers/DireccionController');
var direccionController = new direccion();

var auth = function middleWare(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('err_cred', 'Inicia sesion!!!');
        res.redirect('/josselynStore/login');
    }
};

router.get('/josselynStore', function(req, res, next) {
    if(req.isAuthenticated()){
        res.redirect('/josselynStore/inicio');
    }else{
        res.render('fragmentos/frm_areacenter', { title: 'Josselyn`s Store', login: req.isAuthenticated()});
    }
  
});
router.get('/josselynStore/cerrar_session', function(req, res, next){
    req.session.destroy();
    res.redirect('/josselynStore');
});

router.get('/josselynStore/inicio', auth, ProductoController.verInicio);



router.get('/josselynStore/registro', function(req, res, next) {
  res.render('fragmentos/registro', { title: 'Josselyn`s Store' });
});
router.get('/josselynStore/login', function(req, res, next) {
    if(req.isAuthenticated()){
        res.redirect('/josselynStore/inicio');
    }else{
     res.render('fragmentos/login', { title: 'Josselyn`s Store' , error: req.flash('err_cred')});   
    }
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
router.get('/josselynStore/administrar/marca',auth, MarcaController.verMarca);
router.post('/josselynStore/administrar/marca/guardar',auth,MarcaController.guardar);
router.post('/josselynStore/administrar/marca/modificar',auth,MarcaController.modificar);

//productos
router.get('/josselynStore/administrar/producto', auth, ProductoController.verProducto);
router.post('/josselynStore/administrar/producto/guardar',auth,ProductoController.guardar);
router.post('/josselynStore/administrar/producto/modificar',auth,ProductoController.modificar);

//router.post('/josselynStore/administrar/producto/guardar_foto/:external', auth, ProductoController.guardarImagen);
router.post('/josselynStore/administrar/producto/guardar_foto', auth, ProductoController.guardarImagen);

//carrito
router.get('/josselynStore/compra/carrito/obtener', auth,  carritoController.mostrarCarrito);
router.get('/josselynStore/compra/carrito/quitar/:external', auth,  carritoController.quitar_item);
router.get('/josselynStore/compra/carrito/agregar/:external', auth,  carritoController.agregar_item);
router.get('/josselynStore/compra/carrito/:external', auth,  carritoController.cargarCarro);

//venta
router.get('/josselynStore/venta', auth,  ventaController.mostrarCarritoFinalizado);
router.post('/josselynStore/venta/guardar/:total', auth,  ventaController.guardar);

//envio
router.get('/josselynStore/envio/direccion', auth,  direccionController.verDireccion);
router.post('/josselynStore/envio/direccion/guardar', auth,  direccionController.guardar);
router.post('/josselynStore/envio/direccion/modificar', auth,  direccionController.modificar);

//pago
router.get('/josselynStore/pago', auth,  direccionController.pago);
router.get('/josselynStore/resultado', auth,  direccionController.resultadoPago);
module.exports = router;


