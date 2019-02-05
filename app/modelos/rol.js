module.exports = function (sequelize, Sequelize){
    var Rol = sequelize.define('rol', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
            
        },
        nombre: {
            type: Sequelize.STRING(20)
        }
    }, {freezeTableName: true, timestamps: false});
    
    Rol.associate = function (modelos){
        modelos.rol.hasMany(modelos.persona, {
            foreignKey: 'id_rol'
        });  
    };
    return Rol;
};

