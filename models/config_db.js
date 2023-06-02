const Sequelize = require('sequelize');

const sequelize = new Sequelize('wizard_gpt', 'thay_potter', '7845', {
    host: 'localhost',
    dialect: 'mysql' 
  });

  /*Função somente para o desenvolvedor saber se a conexao foi bem sucedida */
  sequelize.authenticate()
  .then(function(){
    console.log('Connection has been established successfully.');
  }).catch(function(){
    console.error('Unable to connect to the database:', error);
  });

  module.exports = sequelize; /*exportar conexao */
