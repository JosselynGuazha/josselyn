module.exports = function (sequelize, Sequelize){
    var persona = require('./persona');
    var Persona = new persona(sequelize, Sequelize);
    
    var transaccion = require('./transaccion');
    var Transaccion = new transaccion(sequelize, Sequelize);
    var Venta = sequelize.define('venta', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER  
        },
       
        external_id: {
            type: Sequelize.UUID
        },
        subtotal:{
            type:Sequelize.DOUBLE
        },
        iva:{
            type:Sequelize.DOUBLE
        },
        descuento: {
            type: Sequelize.DOUBLE
        },
        total: {
            type: Sequelize.DOUBLE
        },
        estado: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    }, {freezeTableName: true, timestamps: false});
    
   Venta.belongsTo(Persona, {
        foreignKey: 'id_persona',
        constraints: false

    });
    Venta.belongsTo(Transaccion, {
        foreignKey: 'id_transaccion',
        constraints: false
    });
    Venta.associate= function (models){
        models.venta.hasMany(models.detalleProducto, {
            foreignKey:'id_venta'});
    };
    return Venta;
};


