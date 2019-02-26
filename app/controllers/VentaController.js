'use strict';
var models = require('./../modelos');
var Producto = models.producto;
var Marca = models.marca;
var Transaccion=models.transaccion;
var Persona = models.persona;
var Venta = models.venta;
var Detalle = models.detalleProducto;
const uuidv4 = require('uuid/v4');

// variables para realizar pago
var total;
var detalle = [];
var idVenta;
var estado;
var subtotal;
var iva ;
var https = require('https');
var querystring = require('querystring');
var checkout;
var jsonRes = '';

class VentaController {
    /**
     * Mostrar Carrito
     * @sección de Venta
     *  @type  get
     * @url  /josselynStore/compra/carrito/obtener
     *  @param {string} req Venta
     *  @param  {string} res Lista del carrito
     *  @returns {undefined} Vista del Carrito 
     **/
    mostrarCarritoFinalizado(req, res) {
        res.render('fragmentos/carrito',
                {titulo: "Venta",
                    rol: req.user.nombre,
                    mensaje: req.flash("mensajito"),
                    login: req.isAuthenticated()
                });
    }
    
    /**
     * Mostrar Venta
     * @sección de Venta
     *  @type  get
     * @url  /josselynStore/mostrar/ventas
     *  @param {string} req Encontrar todas  las ventas
     *  @param  {string} res Lista del ventas
     *  @returns {undefined} Vista de Ventas
     **/
  mostrarVenta(req, res) {  
         Venta.findAll({include:{model:Persona}}).then(function (venta) {
            if (venta) {
                console.log(venta);
              res.render('fragmentos/mostrarVentas',
                {titulo: "Ventas",
                    rol: req.user.nombre,
                    lista:venta,
                    mensaje: req.flash("mensajito"),
                    login: req.isAuthenticated()
                });
            } 
        }).catch(function (err) {
                console.log("Error:", err);
               
                res.redirect('');;

    });
           
}   

/**
     * Mostrar Reporte
     * @sección de Venta
     *  @type  get
     * @url  /josselynStore/reporte
     *  @param {string} req Encontrar todos los detalles de producto
     *  @param  {string} res Lista Carrito
     *  @returns {undefined} Vista de Reporte
     **/
  mostrarReporte(req, res) {
     Detalle.findAll({include:[{model:Producto},{model:Venta}],where:{id_venta:idVenta}}).then(function (Dproducto) {  
         
         console.log(Dproducto);
         if (Dproducto) {
                console.log(Dproducto);
                      res.render('fragmentos/reporte',
                {titulo: "Reporte",                    
                    rol: req.user.nombre,
                    mensaje: req.flash("mensajito"),
                    login: req.isAuthenticated(),
                    lista: Dproducto,
                    total: total,
                    subtotal:subtotal,
                    iva:iva
                    
                });
               
            } 
        }).catch(function (err) {
                console.log("Error:", err);
            res.redirect('');;

    });
}
    
/**
     * Guardar Venta
     * @sección de Venta
     *  @type  post
     * @url  /josselynStore/venta/guardar
     *  @param {string} req 
     *  @param  {string} res redirecciona a la vista Direccion
     **/
    guardar(req, res) {
        
        var carrito = req.session.carrito;
        var user = req.user.id_persona;

        Persona.findOne({where: {external_id: user}}).then(function (persona) {
            
            var venta = {
                external_id: uuidv4(),
                fecha: new Date(),
                subtotal: req.body.subtotal,
                iva: req.body.iva,
                total: req.body.total,
                id_persona: persona.id

            };
            Venta.create(venta).then(function (newVenta, created) {
                if (newVenta) {

                    total = newVenta.total;
                    subtotal = newVenta.subtotal;
                    iva = newVenta.iva;
                    idVenta = newVenta.id;
                    estado=newVenta.estado;
                    if (persona) {
                        for (var i = 0; i < carrito.length; i++) {
                            var item = {cantidad: carrito[i].cant, precio_unitario: carrito[i].pu, precio_total: carrito[i].pt, id_venta: newVenta.id, id_producto: carrito[i].id};
                            detalle[i] = item;
                        }
                        req.session.carrito = [];
                        res.redirect('/josselynStore/envio/direccion');
                    }
                }
            });

        });
    }
    /**
     * elimina una venta que esta en estado Falso
     * @param {type} idVenta id del usuario de compra
     * @returns {undefined} 
     */
    static eliminarVenta(idVenta){
        Venta.destroy({where:{estado:false}});
    }
    
    /**
     * Pago
     * @sección de Venta
     *  @type  get
     * @url /josselynStore/pago
     *  @param {string} req callback
     *  @param  {string} res pago
     **/
    pago(req, res) {

        function request(callback) {
            var path = '/v1/checkouts';
            var data = querystring.stringify({
                'authentication.userId': '8a8294175d602369015d73bf00e5180c',
                'authentication.password': 'dMq5MaTD5r',
                'authentication.entityId': '8a8294175d602369015d73bf009f1808',
                'amount': total, //total de la venta
                'currency': 'USD',
                'paymentType': 'DB'
                
            });
            var options = {
                port: 443,
                host: 'test.oppwa.com',
                path: path,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': data.length
                }
            };
            var postRequest = https.request(options, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    jsonRes = JSON.parse(chunk);
                    return callback(jsonRes);
                });
            });
            postRequest.write(data);
            postRequest.end();
        }

        request(function (responseData) {
            console.log(responseData);
            checkout = responseData.id;
            res.render('fragmentos/pago',
                    {Checkout: checkout,
                    login: req.isAuthenticated()});
        });

    }
/**
     * Resultado Pago
     * @sección de Venta
     *  @type  get
     * @url /josselynStore/resultado
     *  @param {string} req callback
     *  @param  {string} res reporte 
     **/
    resultadoPago(req, res) {
        function request(callback) {
            var path = '/v1/checkouts/' + checkout + '/payment';
            path += '?authentication.userId=8a8294175d602369015d73bf00e5180c';
            path += '&authentication.password=dMq5MaTD5r';
            path += '&authentication.entityId=8a8294175d602369015d73bf009f1808';
            var options = {
                port: 443,
                host: 'test.oppwa.com',
                path: path,
                method: 'GET'
            };
            var postRequest = https.request(options, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    jsonRes = JSON.parse(chunk);
                    return callback(jsonRes);
                });
            });
            postRequest.end();
        }
        request(function (responseData) {
            console.log(responseData);
            Transaccion.create({
               tipo_tarjeta:responseData.paymentBrand,
               digitos:responseData.card.last4Digits
            }).then(function(newTransaccion,created){
                Venta.update({
                    id_transaccion:newTransaccion.id,
                    estado:true
                },{where:{id:idVenta}}).then(function(updateVenta, created){
                     if (updateVenta) {
                Detalle.bulkCreate(detalle).then(() => { 
                    return Detalle.findAll({where: {id_venta: idVenta}});
                }).then(detalles => {
                    detalles.forEach(function (item) {
                        Producto.findOne({where: {id: item.id_producto}}).then(function (productito) {
                            Producto.update({cantidad: productito.cantidad - item.cantidad}, {where: {id: item.id_producto}});
                            estado:'true';
                            res.redirect('/josselynStore/reporte');
                        });
                    });
                });
            }else{
                
                res.redirect('/josselynStore/pago');
            }
                });
            });
           
            
        });

    }
    
}
module.exports = VentaController;