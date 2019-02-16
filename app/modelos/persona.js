module.exports = function (sequelize, Sequelize) {
    var rol = require('./rol');
    var Rol = new rol(sequelize, Sequelize);
    var Persona = sequelize.define('persona', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        nombre: {
            type: Sequelize.STRING(50)
        },
        apellido: {
            type: Sequelize.STRING(50)
        },
        cedula: {
            type: Sequelize.STRING(10),
            allowNull: false,
            unique: true
        },
        external_id: {
            type: Sequelize.UUID
        },
        direccion: {
            type: Sequelize.STRING
        },
        telefono: {
            type: Sequelize.STRING(15)
        },
        estado: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }

    }, {freezeTableName: true,
        createdAt: "fecha_registro",
        updateAt: 'fecha_modificacion'
    });
 
    Persona.belongsTo(Rol, {
        foreignKey: 'id_rol',
        constraints: true

    });
    Persona.associate = function (models) {
        models.persona.hasOne(models.cuenta, {
            foreignKey: 'id_persona',
            mandatory:   true
        });
        
//  models.persona.hasOne(models.direccion, {
//            foreignKey: 'id_persona'
//            
//            
//        });
        
        models.persona.hasMany(models.venta, {
            foreignKey: 'id_persona'
        });
    };
    return Persona;
};

