module.exports = function (sequelize, DataTypes) {
    var Text = sequelize.define("Text", {
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        sendDate: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sendTime: {
            type: DataTypes.STRING,
            allowNull: false
        }

    });

    // Text.associate = function (models) {
    //     Text.belongsTo(models.User, {
    //         foreignKey: {
    //             allowNull: false
    //         }
    //     });
    // };

    return Text;
};