module.exports = function (sequelize, Sequelize) {
    var persona = require('./persona');
    var Persona = new persona(sequelize, Sequelize);
    var Cuenta = sequelize.define('cuenta', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        correo: {
            type: Sequelize.STRING(30)
        },
        clave: {
            type: Sequelize.STRING
        },
        external_id: {
            type: Sequelize.UUID
        },
        estado: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        token: {
            type: Sequelize.TEXT
        }

    }, {freezeTableName: true,
        createdAt: "fecha_registro",
        updateAt: 'fecha_modificacion'
    });

    Cuenta.belongsTo(Persona, {
        foreignKey: 'id_persona',
        constraints: false

    });
    return Cuenta;
};


