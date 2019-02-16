'use strict';
var models = require('./../modelos');
var Producto = models.producto;
var Marca = models.marca;
var Persona = models.persona;
var Venta = models.venta;
var Detalle = models.detalleProducto;
const uuidv4 = require('uuid/v4');
class VentaController {
    mostrarCarritoFinalizado(req, res) {
        res.render('fragmentos/carrito',
                {titulo: "Venta",
               
                    rol: req.user.rol,
                    mensaje:req.flash("mensajito"),
                    login: req.isAuthenticated()
                });
    }

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
                    var detalle = [];
                    if (persona) {
                        for (var i = 0; i < carrito.length; i++) {
                            var item = {cantidad: carrito[i].cant, precio_unitario: carrito[i].pu, precio_total: carrito[i].pt, id_venta: newVenta.id, id_vino: carrito[i].id};
                            detalle[i] = item;
                        }
                        Detalle.bulkCreate(detalle).then(() => { // Notice: There are no arguments here, as of right now you'll have to...
                            return Detalle.findAll({where:{id_venta: newVenta.id}});
                        }).then(detalles => {                            
                            detalles.forEach(function (item){
                                Producto.findOne({where: {id: item.id_producto}}).then(function (productito){
                                    Producto.update({ cantidad : productito.cantidad-item.cantidad },{ where : { id : item.id_producto }});
                                req.flash('mensajito','La compra ha sido exitosa... :)');
                                res.redirect('/josselynStore/venta');
                                });
                                //Vino.update({ cantidad : "(vino.cantidad - "+item.cantidad+")" },{ where : { id : item.id_vino }});
                            });
                        });
                        req.session.carrito = [];
                        res.redirect("/josselynStore/envio/direccion");
                    } else {

                    }
                }
            });

        });
    }
}
module.exports = VentaController;