module.exports = function (sequelize
        , Sequelize) {
    var marca = require('../modelos/marca');
    var Marca = new marca(sequelize, Sequelize);
    var Producto = sequelize.define('producto', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
            allowNull: false

        },
        external_id: {
            type: Sequelize.UUID
        },
        nombre: {
            type: Sequelize.STRING(50),
            allowNull: false

        },
        tipo: {
            type: Sequelize.STRING(50)
        },
        talla: {
            type: Sequelize.STRING
        },
        cantidad: {
            type: Sequelize.INTEGER
        },

        color: {
            type: Sequelize.STRING
        },
        descripcion: {
            type: Sequelize.STRING,
            allowNull: false
        },
        precio: {
            type: Sequelize.DOUBLE(10, 2)
        },
        foto: {
            type: Sequelize.TEXT
        },
        categoria: {
            type: Sequelize.STRING(50)
        }


        //para que no ponga s al final
    }, {timestamps: false,
        freezeTableName: true});
    
    Producto.associate= function (models){
        models.producto.hasMany(models.detalleProducto, {
            foreignKey:'id_producto'});
    };
    
    
    Producto.belongsTo(Marca, {
        foreignKey: 'id_marca',
        constraints: true
    });
    return Producto;
};
