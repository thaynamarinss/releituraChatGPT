const db = require('./config_db');
const Sequelize = require('sequelize');

const Chat = db.define('Chat', {
  chat_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  user_id: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  nome_chat: {
    type: Sequelize.STRING(200),
    allowNull: true
  },
  chat_date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  }
}, {
  tableName: 'chat',
  timestamps: false
});

// Exportando o modelo Chat
module.exports = Chat;
