module.exports = function (sequelize, DataTypes) {
    var List = sequelize.define("List", {
        title: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        itemOrder: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: ''
        }
    });

    List.associate = function (models) {
        List.hasMany(models.ListItem, {
            onDelete: 'cascade', 
            hooks: true
        });
        List.belongsTo(models.User, {
            foreignKey: {
                allowNull: true
            }
        });
    };

    return List;
};