module.exports=function(sequelize
, Sequelize){
    var producto=require('../modelos/producto');
    var Producto = new producto(sequelize,Sequelize);
    var DetalleProducto= sequelize.define('detalleProducto',{
    id:{
        autoIncrement:true,
        primaryKey:true,
        type:Sequelize.INTEGER,
         allowNull:false
    },
   cantidad:{
        type: Sequelize.INTEGER,
        allowNull:false
    },
    precioUnitario:{
        type: Sequelize.DOUBLE(5,5),
        allowNull:false
    },
   precioTotal:{
        type: Sequelize.DOUBLE(5,5),
        allowNull:false
    }
    
    //para que no ponga s al final
}, {timestamps:false,
    freezeTableName:true});
DetalleProducto.belongsTo(Producto,{
    foreignKey:'id_producto',
    constraints: true
});

return DetalleProducto;
};



