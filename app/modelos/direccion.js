module.exports = function (sequelize, Sequelize) {
    var persona = require('./persona');
    var Persona = new persona(sequelize, Sequelize);
    var Direccion = sequelize.define('direccion', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        ciudad:{
            type: Sequelize.STRING(30)
        },
        barrio:{
            type: Sequelize.STRING
        },
        calle_principal: {
            type: Sequelize.STRING(30)
        },
        calle_secundaria: {
            type: Sequelize.STRING
        },
        external_id: {
            type: Sequelize.UUID
        },
      
        nro_casa: {
            type: Sequelize.STRING
        },
        referencia: {
            type: Sequelize.STRING
        }
    }, {timestamps: false,
        freezeTableName: true
        
        
    });

    Direccion.belongsTo(Persona, {
        foreignKey: 'id_persona',
        constraints: true

    });
    return Direccion;
};




