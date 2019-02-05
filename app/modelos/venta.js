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
        fotos:{
            type:Sequelize.STRING 
        },
        external_id: {
            type: Sequelize.UUID
        },
        subtotal:{
            type:Sequelize.DOUBLE(5,5)
        },
        iva:{
            type:Sequelize.DOUBLE(5,5)
        },
        descuento: {
            type: Sequelize.DOUBLE(5,5)
        },
        total: {
            type: Sequelize.DOUBLE(5,5)
        }
    }, {freezeTableName: true, timestamps: false});
    
   Venta.belongsTo(Persona, {
        foreignKey: 'id_persona',
        constraints: true

    });
    Venta.belongsTo(Transaccion, {
        foreignKey: 'id_transaccion',
        constraints: true

    });
    return Venta;
};


