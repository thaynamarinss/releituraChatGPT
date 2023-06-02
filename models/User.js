const db = require('./config_db');  // Definindo o modelo User
const Sequelize = require('sequelize');

const User = db.define('User', {
    username: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    password: {
      type: Sequelize.STRING(50),
      allowNull: false
    }
  },{
    tableName: 'users',
    timestamps: false 
  });
  
  async function printUsers() {
    try {
      const users = await User.findAll();
      users.forEach((user) => {
        console.log(`Username: ${user.username}, Password: ${user.password}`);
      });
    } catch (error) {
      console.error('Error retrieving users:', error);
    }
  }
  
  //printUsers();


  // Exportando o modelo User
  module.exports = User;