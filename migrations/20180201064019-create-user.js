'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(100)
      },
      first_name: {
        type: Sequelize.STRING(50)
      },
      last_name: {
        type: Sequelize.STRING(50)
      },
      email: {
        type: Sequelize.STRING(80),
        unique: true,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING(100)
      },
      user_type: {
        type: Sequelize.ENUM("admin", "merchant", "user"),
        defaultValue: "user"
      },
      mobile: {
        type: Sequelize.STRING(20)
      },
      dob: {
        type: Sequelize.DATE
      },
      gender: {
        type: Sequelize.ENUM("male","female"),
      },
      profile_pic: {
        type: Sequelize.STRING(100)
      },
      address: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM("0", "1"),
        defaultValue: "1"
      },
      password_reset_token: {
        type: Sequelize.STRING(100)
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now")
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now")
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};