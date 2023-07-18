const db = require('./config_db');
const Sequelize = require('sequelize');

const Messages = db.define('Messages', {
  message_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  user_id: {
    type: Sequelize.STRING(255),
    allowNull: true
  },
  message: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  is_system_message: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  message_date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  chat_id:{
    type: Sequelize.INTEGER,
    allowNull: true

  }
}, {
  tableName: 'messages',
  timestamps: false
});

// Função para imprimir as mensagens
async function printMessages() {
  try {
    const messages = await Messages.findAll();
    messages.forEach((message) => {
      console.log(`message: ${message.message}`);
    });
  } catch (error) {
    console.error('Error retrieving messages:', error);
  }
}

// Chamada da função para imprimir as mensagens (opcional)
 //printMessages();

module.exports = Messages;
