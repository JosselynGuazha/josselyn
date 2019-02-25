'use strict';

var models = require('../modelos');
var Persona = models.persona;
var Cuenta = models.cuenta;
var Rol = models.rol;
const uuidv4 = require('uuid/v4');
var bCrypt = require('bcrypt-nodejs');

class ModificarUsuario {
    /**
     * Editar Usuario
     * @sección de Usiuario
     *  @type  post
     * @url /josselynStore/editar/usuario
     *  @param {string} req Persona
     *  @param  {string} res redirecciona a vista usuario
     **/
    editar(req, res) {
        Persona.update({
            cedula: req.body.cedula,
            apellido: req.body.apellido,
            nombre: req.body.nombre,
            telefono: req.body.telefono,
            estado: req.body.estado,
            id_rol: req.body.rol
        }, {where: {external_id: req.body.external}}).then(function (editado, err) {
            if (editado) {
                res.redirect('/administrarUsuarios');
            }
        });
    }
    /**
     * Ver perfil Usuario
     * @sección de Usuario
     *  @type  get
     * @url /josselynStore/ver/perfil
     *  @param {string} req rol del usuario
     *  @param  {string} res renderizar a ediatar Perfil
     **/
    verPerfil(req, res) {
        var external = req.user.id_persona;
        if (req.user.rol === "usuario") {
            Persona.findAll({include: [
                    {model: Cuenta}
                ], where: {external_id: external}}).then(function (persona) {
                res.render('fragmentos/editarUsuario',
                        {titulo: 'Modificar perfil personal',
                            persona: persona,
                            session: req.isAuthenticated(),
                            exito: req.flash("exito")
                        });
            });
        } else {
            Persona.findAll({include: [
                    {model: Cuenta}
                ], where: {external_id: external}}).then(function (persona) {
                res.render('fragmentos/editarUsuario',
                        {titulo: 'Modificar perfil personal',
                            persona: persona,
                            roles: "admin",
                            session: req.isAuthenticated(),
                            exito: req.flash("exito")
                        });
            });
        }
    }
    /**
     * Modificar Perfil
     * @sección de Usuario
     *  @type  post
     * @url /josselynStore/modificarPerfil
     *  @param {string} modelo persona
     *  @param  {string} res login
     **/
    modificarPerfil(req, res) {
        Persona.update({
            cedula: req.body.cedula,
            apellido: req.body.apellidos,
            nombre: req.body.nombres,
            telefono: req.body.telefono
        }, {where: {external_id: req.body.externalPersona}}).then(function (actualizadaPersona, err) {
            if (actualizadaPersona) {
                Cuenta.findOne({where: {external_id: req.body.externalCuenta}}).then(function (cuenta) {
                    if (cuenta) {
                        var claveNueva = req.body.clave;
                        var clave = cuenta.clave;
                        if (claveNueva !== clave) {
                            var generateHash = function (password) {
                                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
                            };
                            clave = generateHash(claveNueva);
                        }
                        Cuenta.update({
                            correo: req.body.correo,
                            clave: clave
                        }, {where: {external_id: req.body.externalCuenta}}).then(function (actualizadaCuenta, err) {
                            if (actualizadaCuenta) {
                                res.redirect('/josselynStore/login');
                            }
                        });
                    }
                });

            }

        });

    }

}

module.exports = ModificarUsuario;


