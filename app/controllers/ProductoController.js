'use strict';

var modelos = require('../modelos');
var Producto = modelos.producto;
var Marca = modelos.marca;
var Venta = modelos.venta;
const uuidv4 = require('uuid/v4');
var fs = require('fs');


class ProductoController {
    /**
     * Vista Principal
     * @sección de Inicio
     *  @type  get
     * @url  /josselynStore
     *  @param {string} req estar autentificado
     *  @param  {string} res area inicio
     **/
    verPrincipal(req, res) {
        if (req.isAuthenticated()) {
            res.redirect('/josselynStore/inicio');
        } else {

            Producto.findAll({include: {model: Marca}, where: {estado: true}}).then(function (productos) {
                res.render('fragmentos/frm_areacenter',
                        {
                            lista: productos,
                            title: 'Josselyn`s Store',
                            login: req.isAuthenticated()
                        });
            });
        }


    }
/**
     * Vista Inicio
     * @sección de Administrador/Usuario
     *  @type  get
     * @url  /josselynStore/inicio
     *  @param {string} req  rol del usuario 
     *  @param  {string} res renderisa al inicio
     **/
    verInicio(req, res) {
        var roles = req.user.rol;
        if (roles === "administrador") {

            Producto.findAll({include: {model: Marca}, where: {estado: true}}).then(function (productos) {

                if (req.session.carrito == undefined) {
                    req.session.carrito = [];
                    console.log("************");
                }
                console.log(req.session.carrito);
                Venta.destroy({where: {estado: false}});
                res.render('fragmentos/frm_inicio',
                        {
                            title: 'Josselyn`s Store',
                            rol: req.user.nombre,
                            lista: productos,
                            roles: roles,
                            login: req.isAuthenticated()
                        });

            }).catch(function (err) {
                console.log("Error:", err);
                req.flash('error', 'Hubo un error');
                res.redirect('/josselynStore');
            });
        } else {
            Producto.findAll({include: {model: Marca}, where: {estado: true}}).then(function (productos) {
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

                        });

            }).catch(function (err) {
                console.log("Error:", err);
                req.flash('error', 'Hubo un error');
                res.redirect('/josselynStore');
            });
        }
    }
/**
     * Ver Producto
     * @sección de Producto
     *  @type  get
     * @url  /josselynStore/administrar/producto
     *  @param {string} req   Modelo Marca y producto
     *  @param  {string} res redirecciona al registro persona
     **/
    verProducto(req, res) {
        Marca.findAll().then(function (marcas) {
            Producto.findAll({include: {model: Marca}, where: {estado: true}}).then(function (productos) {
                res.render('fragmentos/frm_registroProducto',
                        {titulo: "Administracion de Productos",
                            rol: req.user.nombre,
                            lista: productos,
                            listaM: marcas,
                            login: req.isAuthenticated()

                        });

            }).catch(function (err) {
                console.log("Error:", err);
                req.flash('error', 'Hubo un error');
                res.redirect('/josselynStore');
            });
        });



    }
    static eliminarVenta(idVenta){
        Venta.destroy({where:{estado:false}});
    }
/**
     * Ver Todos lod Producto
     * @sección de Listar Todos Producto
     *  @type  get
     * @url  /josselynStore/administrar/producto/todos
     *  @param {string} req  rol de la persona
     *  @param  {string} res registro Prodcto
     **/
    verProductoTodos(req, res) {

        if (req.user.rol === "administrador") {
            Marca.findAll().then(function (marcas) {
                Producto.findAll({include: {model: Marca}}).then(function (productos) {
                    res.render('fragmentos/frm_registroProducto',
                            {titulo: "Administracion de Productos",

                                rol: req.user.nombre,
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
/**
     * Ver Marca en Producto
     * 
     * @sección de Listar marcas en Producto
     * @url  /josselynStore/administrar/producto
     *  @type  get
     *  @param {string} req requeriere Modelo Marca   
     *  @param  {string} res lista 
     *  @returns {type} Vista  fragmentos/frm_registroProducto
     *  
     **/
    
    verRegistro(req, res) {
        Marca.findAll({where: {estado: true}}).then(function (marcas) {
            res.render('layout',
                    {titulo: "Administracion de Productos",
                        fragmento: 'fragmentos/frm_registroProducto',
                       rol: req.user.nombre,
                        marcas: marcas

                    });

        }).catch(function (err) {
            console.log("Error:", err);
            req.flash('error', 'Hubo un error');
            res.redirect('/josselynStore');
        });

    }
/**
     * Guardar Producto
     * @sección de guardar Producto
     *  @type  post
     * @url  /josselynStore/administrar/producto/guardar
     *  @param {string} req  modelo Producto, parametros del body 
     *  @param  {string} res renderiza administrar producto
     **/
    guardar(req, res) {
        Producto.create({
            external_id: uuidv4(),
            nombre: req.body.nombre,
            foto: 'vestidonegroLargo.jpg',
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
/**
     * Modificar Producto
     * @sección de modificar Producto
     *  @type  post
     * @url  /josselynStore/administrar/producto/modificar
     *  @param {string} req  parametros de body
     *  @param  {string} res modificar y renderiza abministrar productos
     **/
  
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
/**
     * Guardar Foto Producto
     * @sección de foto Producto
     *  @type  post
     * @url  /josselynStore/administrar/producto/guardar_foto
     *  @param {string} req  parametros externos de una url 
     *  @param  {string} resadministrar productos
     **/
  
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
/**
     * Buscar Producto
     * @sección de buscar Producto
     *  @type  post
     * @url  /buscar/categoria
     *  @param {string} req    encontrar producto
     *  @param  {string} res area centrar a mostrar 
     **/
    verBuscarCategoria(req, res) {
        Producto.findAll({where: {estado: true, categoria: req.body.buscar}}).then(function (producto) {
            res.render('fragmentos/frm_areacenter',
                    {titulo: 'Administrar Producto',
                        lista: producto,
                        rol: req.user.nombre
                    });
        }).catch(function (err) {
            console.log("Error:", err);
            //req.flash('error', 'Hubo un error');
            res.redirect('');
        });



    }
}

module.exports = ProductoController;

