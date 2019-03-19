module.exports = function (sequelize, DataTypes) {
    var ListItem = sequelize.define("ListItem", {
        item: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

    ListItem.associate = function (models) {
        ListItem.belongsTo(models.List, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    return ListItem;
};