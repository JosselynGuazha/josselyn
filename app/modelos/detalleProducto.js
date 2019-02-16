module.exports=function(sequelize
, Sequelize){
    var producto=require('../modelos/producto');
    var Producto = new producto(sequelize,Sequelize);
    
    var venta=require('../modelos/venta');
    var Venta = new venta(sequelize,Sequelize);
    
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
    precio_unitario:{
        type: Sequelize.DOUBLE,
        allowNull:false
    },
   precio_total:{
        type: Sequelize.DOUBLE,
        allowNull:false
    }
    
    //para que no ponga s al final
}, {timestamps:false,
    freezeTableName:true});
DetalleProducto.belongsTo(Producto,{
    foreignKey:'id_producto',
    constraints: false
});

DetalleProducto.belongsTo(Venta,{
    foreignKey:'id_venta',
    constraints: false
});
return DetalleProducto;
};



