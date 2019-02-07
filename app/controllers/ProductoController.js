'use strict';
var modelos = require('../modelos');
var Producto = modelos.producto;
var Marca = modelos.marca;
const uuidv4 = require('uuid/v4');

//para subir archivos
//var fs = require('fs');
//var maxFileSize = 1 * 1024 * 1024;
//var extensiones = ["jpg", "png"];
//var formidable = require('formidable');

class ProductoController {
    verProducto(req, res) {

        Producto.findAll({include: {model: Marca}}).then(function (productos) {

            res.render('layout',
                    {titulo: "Administracion de Productos",
                        fragmento: 'fragmentos/frm_registroProducto',
                        rol: req.user.rol,
                        lista: productos
                        //info: (req.flash('info') != '') ? req.flash('info') : '',
                        //error: (req.flash('error') != '') ? req.flash('error') : ''
                    });

        }).catch(function (err) {
            console.log("Error:", err);
            req.flash('error', 'Hubo un error');
            res.redirect('/josselynStore');
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
            //foto: 'sin_botella.png'
        }).then(function (newProducto, created) {
            if (newProducto) {
                req.flash('info', 'Se ha creado correctamente');
                res.redirect('/josselynStore/administrar/producto');
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
            //foto: 'sin_botella.png'
        }, {where: {external_id: req.body.external}}).then(function (updatedProducto, created) {
            if (updatedProducto) {
                req.flash('info', 'Se ha creado correctamente', false);
                res.redirect('/josselynStore/administrar/producto');
            }
        });
    }

    verFoto(req, res) {
        res.render('layout', {
            titulo: "Administrador de Productos",
            fragmento: 'fragmentos/frm_fotoProducto',
            //rol: req.user.rol,
            external: req.params.external
            //info: (req.flash('info') != '') ? req.flash('info') : '',
            //error: (req.flash('error') != '') ? req.flash('error') : ''
        });
    }

//    guardarImagen(req, res) {
//
//        /* var form = new formidable.IncomingForm();
//         form.parse(req, function (err, fields, files) {
//         if (files.archivo.size <= maxFileSize) {
//         var extension = files.archivo.name.split(".").pop().toLowerCase();
//         if (extensiones.includes(extension)) {
//         var nombre = fields.external + "." + extension;
//         fs.rename(files.archivo.path, "public/img/" + nombre, function (err) {
//         if (err)
//         next(err);
//         Vino.update({
//         foto: nombre,
//         }, {where: {external_id: fields.external}}).then(function (updateVino, created) {
//         if (updateVino) {
//         req.flash('info', 'Se ha subido correctamente', false);
//         res.redirect('/josselyn/adminstrador/vino');
//         }
//         });
//         });
//         } else {
//         VinoController.eliminar(files.archivo.path);
//         req.flash('error', 'Error de extension', false);
//         res.redirect('/josselyn/administrar/vino/foto' + fields.external);
//         console.log("error de extension");
//         
//         }
//         } else {
//         VinoController.eliminar(files.archivo.path);
//         req.flash('error', 'Error de tamanio se admite ', + maxFileSize, false);
//         res.redirect('/josselyn/administrar/vino/foto' + fields.external);
//         console.log("error de tamanio solo se admite " + maxFileSize);
//         }
//         }); */
//
//        Producto.update({
//            //foto: req.body.foto
//        }, {where: {external_id: req.params.external}}).then(function (updateProducto, created) {
//            if (updateProducto) {
//                console.log("Se ha subido correctamente");
//                req.flash('info', 'Se ha subido correctamente', false);
//                res.redirect('/josselynStore/administrar/producto');
//            }
//        });
//    }

}
module.exports = ProductoController;

