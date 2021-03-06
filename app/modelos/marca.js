module.exports=function(sequelize, Sequelize){
    var Marca= sequelize.define('marca',{
    id:{
        autoIncrement:true,
        primaryKey:true,
        type:Sequelize.INTEGER,
        allowNull:false
        
    },
    nombre:{
        type: Sequelize.STRING(50)
    },
    external_id:{
        type: Sequelize.UUID
    },
        estado: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    
}, {timestamps:false,
    freezeTableName:true});

 Marca.associate = function (models) {
        models.marca.hasMany(models.producto, {
            foreignKey: 'id_marca'
        });
    };

return Marca;
};



