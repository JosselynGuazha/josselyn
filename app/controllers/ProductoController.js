'use strict';
var modelos = require('../modelos');
var Producto = modelos.producto;
var Marca = modelos.marca;
const uuidv4 = require('uuid/v4');

class ProductoController {
    
    verProducto(req, res) {
        
        
        Marca.findAll().then(function (marcas) {
       Producto.findAll({include: {model: Marca}}).then(function (productos) {
            res.render('fragmentos/frm_registroProducto',
                    {titulo: "Administracion de Productos",
                       
                        //rol: req.user.rol,
                        //lista: productos,
                        listaM: marcas
                        //info: (req.flash('info') != '') ? req.flash('info') : '',
                        //error: (req.flash('error') != '') ? req.flash('error') : ''
                    });

        }).catch(function (err) {
            console.log("Error:", err);
            req.flash('error', 'Hubo un error');
            res.redirect('/josselynStore');
        });   
        });

        

    }
    //comprobar si esta como usuario o como abministrador

    verRegistro(req, res) {

        Marca.findAll({where: {estado: true}}).then(function (marcas) {

            res.render('layout',
                    {titulo: "Administracion de Productos",
                        fragmento: 'fragmentos/frm_registroProducto',
                        rol: req.user.rol,
                        marcas: marcas
                        //info: (req.flash('info') != '') ? req.flash('info') : '',
                        //error: (req.flash('error') != '') ? req.flash('error') : ''
                    });

        }).catch(function (err) {
            console.log("Error:", err);
            req.flash('error', 'Hubo un error');
            res.redirect('/josselynStore');
        });

    }

    guardar(req, res) {
        Producto.create({
            external_id: uuidv4(),
            nombre: req.body.nombre,
            //fecha_creacion: req.body.fecha,
            tipo: req.body.tipo,
            talla: req.body.talla,
            cantidad:req.body.cantidad,
            descripcion:req.body.descripcion,
            precio: req.body.precio,
            color: req.body.color,
            id_marca: req.body.marca
           
        }).then(function (newProducto, created) {
            if (newProducto) {
                req.flash('info', 'Se ha creado correctamente');
                res.redirect('/josselynStore/administrar/producto');
                console.log('se ha guardado')
            }
        });
    }
    

    verEditar(req, res) {
        Producto.findOne({where: {external_id: req.params.external}}).then(function (producto) {
            if (producto) {
                Marca.findAll({where: {estado: true}}).then(function (marcas) {
                    res.render('layout',
                            {titulo: "Administracion de Productos",
                                fragmento: 'fragmentos/frm_registroProducto',
                                //rol: req.user.rol,
                                marcas: marcas,
                                producto: producto
                                //info: (req.flash('info') != '') ? req.flash('info') : '',
                                //error: (req.flash('error') != '') ? req.flash('error') : ''
                            });

                }).catch(function (err) {
                    console.log("Error:", err);
                    req.flash('error', 'Hubo un error');
                    res.redirect('/josselynStore/administrar/producto');
                });
            } else {

            }
        });

    }

    modificar(req, res) {
        Producto.update({
            external_id: uuidv4(),
            nombre: req.body.nombre,
            //fecha_creacion: req.body.fecha,
            tipo: req.body.tipo,
            talla: req.body.talla,
            cantidad:req.body.cantidad,
            descripcion:req.body.descripcion,
            precio: req.body.precio,
            color: req.body.color,
            id_marca: req.body.marca
        }, {where: {external_id: req.body.external}}).then(function (updatedProducto, created) {
            if (updatedProducto) {
                req.flash('info', 'Se ha creado correctamente', false);
                res.redirect('/josselynStore/administrar/producto');
            }
        });
    }


}
module.exports = ProductoController;

