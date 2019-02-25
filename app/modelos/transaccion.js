module.exports = function (sequelize, Sequelize){
    var Transaccion = sequelize.define('transaccion', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
            
        },
        tipo_tarjeta: {
            type: Sequelize.STRING
        },
        digitos: {
            type: Sequelize.STRING
        }
        
    }, {freezeTableName: true, timestamps: false});
    
    Transaccion.associate = function (modelos){
        modelos.transaccion.hasMany(modelos.venta, {
            foreignKey: 'id_transaccion'
        });  
    };
    return Transaccion;
};


