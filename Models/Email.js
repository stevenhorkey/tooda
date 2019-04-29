module.exports = function (sequelize, DataTypes) {
    var Email = sequelize.define("Email", {
        html: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        text: {
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
        },

    });

    return Email;
};