module.exports=function(sequelize
, Sequelize){
    var marca=require('../modelos/marca');
    var Marca = new marca(sequelize,Sequelize);
    var Producto= sequelize.define('producto',{
    id:{
        autoIncrement:true,
        primaryKey:true,
        type:Sequelize.INTEGER,
        allowNull:false
    },
//    foto:{
//        type: Sequelize.STRING(50),
//        allowNull:false
//    },
    nombre:{
        type: Sequelize.STRING(50),
        allowNull:false
        
    },
    tipo:{
        type: Sequelize.STRING(50)
    },
    talla:{
        type: Sequelize.STRING(10)
    },
    
    color:{
        type: Sequelize.STRING
    },
    descripcion:{
        type: Sequelize.STRING,
        allowNull:false
    },
    precio:{
        type: Sequelize.DOUBLE(5,5),
        allowNull:false
    }
  
    
    //para que no ponga s al final
}, {timestamps:false,
    freezeTableName:true});
Producto.belongsTo(Marca,{
    foreignKey:'id_marca',
    constraints: true
});
return Producto;
};
