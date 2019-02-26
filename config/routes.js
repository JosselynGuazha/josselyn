var express = require('express');
var router = express.Router();
var passport = require('passport');

//Controladores
var marca = require('../app/controllers/MarcaController');
var MarcaController = new marca();

var producto = require('../app/controllers/ProductoController');
var ProductoController = new producto();

var carro = require('../app/controllers/CarritoController');
var carritoController = new carro();

var venta = require('../app/controllers/VentaController');
var ventaController = new venta();

var direccion = require('../app/controllers/DireccionController');
var direccionController = new direccion();

var usuario = require('../app/controllers/ModificarUsuario');
var usuarioController = new usuario();

//controlador para la autentificación
var auth = function middleWare(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('err_cred', 'Inicia sesion!!!');
        res.redirect('/josselynStore/login');
    }
};

//Inicio o Principal 
router.get('/josselynStore', ProductoController.verPrincipal);
router.get('/josselynStore/cerrar_session', function (req, res, next) {
    req.session.destroy();
    res.redirect('/josselynStore');
});
router.get('/josselynStore/inicio', auth, ProductoController.verInicio);


//Registro de la persona
router.get('/josselynStore/registro', function (req, res, next) {
    res.render('fragmentos/registro', {title: 'Josselyn`s Store', error: req.flash('correo_repetido')});
});
router.post('/josselynStore/registro/guardar',
        passport.authenticate('local-signup', {successRedirect: '/josselynStore/login',
            failureRedirect: '/josselynStore/registro', failureFlash: true}
        ));

//Inicio Session 
router.get('/josselynStore/login', function (req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/josselynStore/inicio');
    } else {
        res.render('fragmentos/login', {title: 'Josselyn`s Store', error: req.flash('err_cred')});
    }
});
router.post('/iniciar_sesion',
        passport.authenticate('local-signin',
                {successRedirect: '/josselynStore/inicio',
                    failureRedirect: '/josselynStore/login',
                    failureFlash: true}
        ));

//marcas
router.get('/josselynStore/administrar/marca', auth, MarcaController.verMarca);
router.post('/josselynStore/administrar/marca/guardar', auth, MarcaController.guardar);
router.post('/josselynStore/administrar/marca/modificar', auth, MarcaController.modificar);

//productos
router.get('/josselynStore/administrar/producto', auth, ProductoController.verProducto);
router.get('/josselynStore/administrar/producto/todos', auth, ProductoController.verProductoTodos);
router.post('/josselynStore/administrar/producto/guardar', auth, ProductoController.guardar);
router.post('/josselynStore/administrar/producto/modificar', auth, ProductoController.modificar);
router.post('/buscar/categoria', ProductoController.verBuscarCategoria);

router.post('/josselynStore/administrar/producto/guardar_foto/:external', auth, ProductoController.guardarImagen);
//router.post('/josselynStore/administrar/producto/guardar_foto', auth, ProductoController.guardarImagen);

//carrito
router.get('/josselynStore/compra/carrito/obtener', auth, carritoController.mostrarCarrito);
router.get('/josselynStore/compra/carrito/quitar/:external', auth, carritoController.quitar_item);
router.get('/josselynStore/compra/carrito/agregar/:external', auth, carritoController.agregar_item);
router.get('/josselynStore/compra/carrito/:external', auth, carritoController.cargarCarro);

//venta
router.get('/josselynStore/venta', auth, ventaController.mostrarCarritoFinalizado);
router.post('/josselynStore/venta/guardar', auth, ventaController.guardar);
router.get('/josselynStore/mostrar/ventas', auth, ventaController.mostrarVenta);


//envio
router.get('/josselynStore/envio/direccion', auth, direccionController.verDireccion);
router.post('/josselynStore/envio/direccion/guardar', auth, direccionController.guardar);


//pago
router.get('/josselynStore/pago', auth, ventaController.pago);
router.get('/josselynStore/resultado', auth, ventaController.resultadoPago);

//reporte
router.get('/josselynStore/reporte', auth, ventaController.mostrarReporte);

//editar usuario
router.post('/josselynStore/editar/usuario', auth, usuarioController.editar);
router.get('/josselynStore/ver/perfil', auth, usuarioController.verPerfil);
router.post('/josselynStore/modificarPerfil', usuarioController.modificarPerfil);
router.get('/guardar_token/:token', usuarioController.guardarToken);

module.exports = router;


