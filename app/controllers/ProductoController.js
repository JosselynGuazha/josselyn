'use strict';
var modelos = require('../modelos');
var Producto = modelos.producto;
var Marca = modelos.marca;
const uuidv4 = require('uuid/v4');
//para subir archivos
var fs = require('fs');
var maxFileSize = 1 * 1024 * 1024;
var extensiones = ["jpg", "png"];
var formidable = require('formidable');

class ProductoController {

    verInicio(req, res) {

        var roles = req.user.rol;
        if (roles === "administrador") {
            Producto.findAll({include: {model: Marca},where:{estado:true}}).then(function (productos) {
                if (req.session.carrito == undefined) {
                    req.session.carrito = [];
                    console.log("************");


                }
                console.log(req.session.carrito);
                res.render('fragmentos/frm_inicio',
                        {
                            title: 'Josselyn`s Store',

                            rol: req.user.nombre,
                            lista: productos,
                            roles: roles,
                            login: req.isAuthenticated()

                                    //info: (req.flash('info') != '') ? req.flash('info') : '',
                                    //error: (req.flash('error') != '') ? req.flash('error') : ''
                        });

            }).catch(function (err) {
                console.log("Error:", err);
                req.flash('error', 'Hubo un error');
                res.redirect('/josselynStore');
            });
        } else {
            Producto.findAll({include: {model: Marca},where:{estado:true}}).then(function (productos) {
                if (req.session.carrito == undefined) {
                    req.session.carrito = [];
                    console.log("************");

                }
                console.log(req.session.carrito);
                res.render('fragmentos/frm_inicio',
                        {
                            title: 'Josselyn`s Store',

                            rol: req.user.nombre,
                            lista: productos,

                            login: req.isAuthenticated()
                                    //info: (req.flash('info') != '') ? req.flash('info') : '',
                                    //error: (req.flash('error') != '') ? req.flash('error') : ''
                        });

            }).catch(function (err) {
                console.log("Error:", err);
                req.flash('error', 'Hubo un error');
                res.redirect('/josselynStore');
            });
        }





    }

    verPrincipal(req, res) {

        if (req.isAuthenticated()) {
            res.redirect('/josselynStore/inicio');
        } else {
            
            Producto.findAll({include: {model: Marca},where:{estado:true}}).then(function (productos) {
                res.render('fragmentos/frm_areacenter',
                        {
                            lista: productos,
                            title: 'Josselyn`s Store',
                            login: req.isAuthenticated()
                        });
            });
        }


    }

    verProducto(req, res) {


        Marca.findAll().then(function (marcas) {
            Producto.findAll({include: {model: Marca}, where: {estado: true}}).then(function (productos) {
                res.render('fragmentos/frm_registroProducto',
                        {titulo: "Administracion de Productos",

                            //rol: req.user.rol,
                            lista: productos,
                            listaM: marcas,
                            login: req.isAuthenticated()
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

    verProductoTodos(req, res) {

        if (req.user.rol === "administrador") {
            Marca.findAll().then(function (marcas) {
                Producto.findAll({include: {model: Marca}}).then(function (productos) {
                    res.render('fragmentos/frm_registroProducto',
                            {titulo: "Administracion de Productos",

                                //rol: req.user.rol,
                                lista: productos,
                                listaM: marcas,
                                login: req.isAuthenticated()
                                        //info: (req.flash('info') != '') ? req.flash('info') : '',
                                        //error: (req.flash('error') != '') ? req.flash('error') : ''
                            });

                }).catch(function (err) {
                    console.log("Error:", err);
                    req.flash('error', 'Hubo un error');
                    res.redirect('/josselynStore');
                });
            });
        } else {
            res.redirect('/josselynStore/administrar/producto');
        }

    }
    //comprobar si esta como usuario o como abministrador

    verRegistro(req, res) {

        Marca.findAll({where: {estado: true}}).then(function (marcas) {

            res.render('layout',
                    {titulo: "Administracion de Productos",
                        fragmento: 'fragmentos/frm_registroProducto',
                        // rol: req.user.rol,
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
            foto: 'logo.png',
            categoria: req.body.categoria,
            tipo: req.body.tipo,
            talla: req.body.talla,
            cantidad: req.body.cantidad,
            descripcion: req.body.descripcion,
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
            categoria: req.body.categoria,
            tipo: req.body.tipo,
            talla: req.body.talla,
            cantidad: req.body.cantidad,
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            color: req.body.color,
            id_marca: req.body.marca,
            estado: req.body.estado
        }, {where: {external_id: req.body.external}}).then(function (updatedProducto, created) {
            if (updatedProducto) {
                req.flash('info', 'Se ha creado correctamente', false);
                res.redirect('/josselynStore/administrar/producto');
            }
        });
    }

    guardarImagen(req, res) {

        console.log(req.params.external);
        Producto.update({
            foto: req.body.foto
        }, {where: {external_id: req.params.external}}).then(function (updateProducto, created) {
            if (updateProducto) {
                console.log("Se ha subido correctamente");
                req.flash('info', 'Se ha subido correctamente', false);
                res.redirect('/josselynStore/administrar/producto');
            } else
            {
                console.log("Hola soy---");
            }
        });
    }

    verBuscarCategoria(req, res) {

        
            Producto.findAll({where: {estado: true, categoria: req.body.buscar}}).then(function (producto) {
                res.render('fragmentos/frm_areacenter',
                        {titulo: 'Administrar Producto',
                            lista: producto
                        });
            }).catch(function (err) {
                console.log("Error:", err);
                //req.flash('error', 'Hubo un error');
                res.redirect('');
            });
      


    }
}
module.exports = ProductoController;

