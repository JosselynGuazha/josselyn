module.exports=function(sequelize, Sequelize){
    var Marca= sequelize.define('marca',{
    id:{
        autoIncrement:true,
        primaryKey:true,
        type:Sequelize.INTEGER,
        allowNull:false
        
    },
    nombre:{
        type: Sequelize.STRING(20)
    },
    external_id:{
        type: Sequelize.UUID
    }
}, {timestamps:false,
    freezeTableName:true});

return Marca;
};



