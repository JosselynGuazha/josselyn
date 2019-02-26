'use strict';
var modelos = require('../modelos');
var Direccion = modelos.direccion;
var Persona = modelos.persona;
var Venta = modelos.venta;
const uuidv4 = require('uuid/v4');



class DireccionController {
    /**
     * Ver Direccion
     * @sección de Direccion
     *  @type  get
     * @url /josselynStore/envio/direccion
     *  @param {string} req Persona y direccion
     *  @param  {string} res  redirecciona a la direccion
     **/
    verDireccion(req, res) {
        console.log("********");
        var externalPersona = req.user.id_persona;
        Persona.findOne({where: {external_id: externalPersona}}).then(function (persona) {
            if (persona) {
                console.log("Entrando a actulizar");
                Direccion.findOne({where: {id_persona: persona.id}}).then(function (direcciones) {
                    if (direcciones) {
                        Direccion.findAll({where: {id_persona: persona.id}}).then(function (direcciones) {
                            res.render('fragmentos/frm_direccion_cliente',
                                    {titulo: "Registro de Direccion",
                                        rol: req.user.nombre,
                                        lista: direcciones,
                                        login: req.isAuthenticated()
                                    });
                        });

                    } else {
                        res.render('fragmentos/frm_direccion_cliente_1',
                                {titulo: "Registro de Direccion",
                                    rol: req.user.nombre,
                                    login: req.isAuthenticated()
                                });
                    }

                }).catch(function (err) {
                    console.log("Error:", err);
                    req.flash('error', 'Hubo un error');
                    res.redirect('error a encontrar la direccion');
                });

            } else {
                res.redirect("persona no encontrada")
            }

        });

    }
    
     static eliminarVenta(idVenta){
        Venta.destroy({where:{estado:false}});
    }
    /**
     * Guardar Direccion
     * @sección de Direccion
     *  @type  post
     * @url /josselynStore/envio/direccion/guardar
     *  @param {string} req Persona y direccion
     *  @param  {string} res redirecciona a pago
     **/
    guardar(req, res) {
        var externalPersona = req.user.id_persona;
        Persona.findOne({where: {external_id: externalPersona}}).then(function (persona) {
            if (persona) {
                console.log("Entrando a actulizar");
                Direccion.findOne({where: {id_persona: persona.id}}).then(function (direcciones) {
                    if (direcciones) {
                        Direccion.update({
                            ciudad: req.body.ciudad,
                            calle_principal: req.body.calle_prin,
                            calle_secundaria: req.body.calle_sec,
                            barrio: req.body.barrio,
                            nro_casa: req.body.num_casa,
                            referencia: req.body.referencia

                        }, {where: {id_persona: persona.id}}).then(function (updatedDireccion, created) {
                            if (updatedDireccion) {
                                req.flash('info', 'Se ha modificado correctamente', false);
                                res.redirect('/josselynStore/pago');

                            }
                        });
                    } else {
                        Direccion.create({
                            external_id: uuidv4(),
                            ciudad: req.body.ciudad,
                            calle_principal: req.body.calle_prin,
                            calle_secundaria: req.body.calle_sec,
                            barrio: req.body.barrio,
                            nro_casa: req.body.num_casa,
                            referencia: req.body.referencia,
                            id_persona: persona.id

                        }).then(function (newDireccion, created) {
                            if (newDireccion) {
                                req.flash('info', 'Se ha guardado correctamente');
                                res.redirect('/josselynStore/pago');
                                console.log('se ha guaradado la marca');
                            }
                        });

                    }



                }).catch(function (err) {
                    console.log("Error:", err);
                    req.flash('error', 'Hubo un error');
                    res.redirect('error a encontrar la direccion');
                });

            } else {
                res.redirect("persona no encontrada")
            }

        });

    }

}
module.exports = DireccionController;





