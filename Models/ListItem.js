module.exports = function (sequelize, DataTypes) {
    var ListItem = sequelize.define("ListItem", {
        value: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        completed: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: 0
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