'use strict';
module.exports = (sequelize, DataTypes) => {
  var UserDevice = sequelize.define('UserDevice', {
    user_id: DataTypes.INTEGER,
    auth_token: DataTypes.TEXT,
    push_token: DataTypes.STRING,
    type: DataTypes.ENUM('android','ios')
  }, {
    classMethods: {
      associate: function(models) {
      }
    },
    timestamps:false,
     tableName: 'user_devices',
  });
  return UserDevice;
};