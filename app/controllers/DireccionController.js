'use strict';
var modelos = require('../modelos');
var Direccion = modelos.direccion;
const uuidv4 = require('uuid/v4');
class DireccionController {
    verDireccion(req, res) {
        console.log("********");
        Direccion.findAll({}).then(function (direcciones) {

            console.log(direcciones + "Ok...");
            res.render('fragmentos/frm_direccion',
                    {titulo: "Registro de Direccion",
                        rol: req.user.rol,
                        lista: direcciones
                        //login: req.isAuthenticated()
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
        Direccion.create({
            external_id: uuidv4(),
            ciudad: req.body.ciudad,
            calle_principal: req.body.calle_prin,
            calle_secundaria: req.body.calle_sec,
            barrio:req.body.barrio,
            nro_casa:req.body.num_casa,
            referencia:req.body.referencia,
            id_persona: req.body.persona
                    
        }).then(function (newDireccion, created) {
            if(newDireccion) {
                req.flash('info', 'Se ha guardado correctamente');
                res.redirect('/josselynStore/pago');
                console.log('se ha guaradado la marca');
            }
        });
    }
    
    modificar(req, res) {
        Direccion.update({            
            ciudad: req.body.ciudad,
            calle_principal: req.body.calle_prin,
            calle_secundaria: req.body.calle_sec,
            barrio:req.body.barrio,
            nro_casa:req.body.num_casa,
            referencia:req.body.referencia
        }, {where: {external_id: req.body.external}}).then(function (updatedDireccion, created) {
            if(updatedDireccion) {
                req.flash('info', 'Se ha modificado correctamente', false);
                res.redirect('/josselynStore');
            }
        });
    }
    
    
    pago(req,res){
        res.render('fragmentos/pago');
        
    }
    
}
module.exports = DireccionController;





