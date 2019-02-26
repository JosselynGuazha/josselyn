'use strict';
var modelos = require('../modelos');
var Marca = modelos.marca;
var Venta=modelos.venta;
const uuidv4 = require('uuid/v4');
class MarcaController {
    /**
     * Ver Marca
     * @sección de Marca
     *  @type  get
     * @url  /josselynStore/administrar/marca
     *  @param {string} req  Modelo Marca y autentificado 
     *  @param  {string} res renderisa a Registra Marca
     **/
    verMarca(req, res) {
        console.log("********");
        Marca.findAll({}).then(function (marcas) {

            //console.log(marcas + "Ok...");
            res.render('fragmentos/frm_registroMarca',
                    {titulo: "Administracion de Marcas",
                       rol: req.user.nombre,
                        lista: marcas,
                        login: req.isAuthenticated()
                    });

        }).catch(function (err) {
            console.log("Error:", err);
            res.redirect('/josselynStore');
        });
        
    }
    /**
     * Gurdar Marca
     * @sección de Marca
     *  @type  post
     * @url  /josselynStore/administrar/marca/guardar
     *  @param {string} req   campos del body
     *  @param  {string} res  administrar marca
     **/
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
    
    static eliminarVenta(idVenta){
        Venta.destroy({where:{estado:false}});
    }
     /**
     * Modificar Marca
     * @sección de Marca
     *  @type  post
     * @url  /josselynStore/administrar/marca/modificar
     *  @param {string} req  campos del body 
     *  @param  {string} res redirecciona administrar marca
     **/
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


