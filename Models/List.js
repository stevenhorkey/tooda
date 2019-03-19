module.exports = function (sequelize, DataTypes) {
    var List = sequelize.define("List", {
        listName: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    });

    List.associate = function (models) {
        List.hasMany(models.ListItem);
        List.belongsTo(models.User, {
            foreignKey: {
                allowNull: true
            }
        });
    };

    return List;
};