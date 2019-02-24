'use strict';
var modelos = require('../modelos');
var Direccion = modelos.direccion;
var Persona = modelos.persona;
var Venta = modelos.venta;
const uuidv4 = require('uuid/v4');

var https = require('https');
var querystring = require('querystring');
// variables para realizar pago
var checkout;
var jsonRes = '';

class DireccionController {
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
                                        rol: req.user.rol,
                                        lista: direcciones,
                                        login: req.isAuthenticated()
                                                //info: (req.flash('info') != '') ? req.flash('info') : '',
                                                //error: (req.flash('error') != '') ? req.flash('error') : ''
                                    });
                        });

                    } else {
                        res.render('fragmentos/frm_direccion_cliente_1',
                                {titulo: "Registro de Direccion",
                                    rol: req.user.rol,
                                    login: req.isAuthenticated()
                                    //info: (req.flash('info') != '') ? req.flash('info') : '',
                                    //error: (req.flash('error') != '') ? req.flash('error') : ''
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

//        Direccion.findAll({}).then(function (direcciones) {
//        
//            console.log(direcciones + "Ok...");
//            res.render('fragmentos/frm_direccion_cliente',
//                    {titulo: "Registro de Direccion",
//                        rol: req.user.rol,
//                        lista: direcciones
//                        //login: req.isAuthenticated()
//                        //info: (req.flash('info') != '') ? req.flash('info') : '',
//                        //error: (req.flash('error') != '') ? req.flash('error') : ''
//                    });
//
//        }).catch(function (err) {
//            console.log("Error:", err);
//            req.flash('error', 'Hubo un error');
//            res.redirect('/josselynStore');
//        });
//        
    }

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

    modificar(req, res) {
        Direccion.update({
            ciudad: req.body.ciudad,
            calle_principal: req.body.calle_prin,
            calle_secundaria: req.body.calle_sec,
            barrio: req.body.barrio,
            nro_casa: req.body.num_casa,
            referencia: req.body.referencia
        }, {where: {external_id: req.body.external}}).then(function (updatedDireccion, created) {
            if (updatedDireccion) {
                req.flash('info', 'Se ha modificado correctamente', false);
                res.redirect('/josselynStore');
            }
        });
    }

        pago(req, res) {

            function request(callback) {
                var path = '/v1/checkouts';
                var data = querystring.stringify({
                    'authentication.userId': '8a8294175d602369015d73bf00e5180c',
                    'authentication.password': 'dMq5MaTD5r',
                    'authentication.entityId': '8a8294175d602369015d73bf009f1808',
                    'amount': 'req.params.pt',
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
                        {Checkout: checkout});
            });

        }
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
            res.redirect('/josselynStore');
        });

    }

}
module.exports = DireccionController;





