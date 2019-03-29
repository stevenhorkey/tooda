module.exports = function (sequelize, DataTypes) {
    var List = sequelize.define("List", {
        listName: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 1
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