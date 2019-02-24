'use strict';
var modelos = require('../modelos');
var Marca = modelos.marca;
const uuidv4 = require('uuid/v4');
class MarcaController {
    verMarca(req, res) {
        console.log("********");
        Marca.findAll({}).then(function (marcas) {

            //console.log(marcas + "Ok...");
            res.render('fragmentos/frm_registroMarca',
                    {titulo: "Administracion de Marcas",
                       rol: req.user.rol,
                        lista: marcas,
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
    
    guardar(req, res) {
        Marca.create({
            external_id: uuidv4(),
            nombre: req.body.nombre
        }).then(function (newMarca, created) {
            if(newMarca) {
                req.flash('info', 'Se ha creado correctamente');
                res.redirect('/josselynStore/administrar/marca');
                console.log('se ha guaradado la marca')
            }
        });
    }
    
    modificar(req, res) {
        Marca.update({            
            nombre: req.body.nombre,
            estado: req.body.estado
            
        }, {where: {external_id: req.body.external}}).then(function (updatedMarca, created) {
            if(updatedMarca) {
                req.flash('info', 'Se ha creado correctamente', false);
                res.redirect('/josselynStore/administrar/marca');
            }
        });
    }
    
}
module.exports = MarcaController;


