/*Express gerencia requisições/rotas */
// nodemon app.js para executar
const express = require('express');
const app = express();
const path = require('path');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const cors = require('cors');
 
// Habilitar o middleware CORS
app.use(cors());
// Define o caminho para os arquivos estáticos
app.use(express.static(path.join(__dirname)));
// Middleware para fazer o parsing do corpo das requisições como JSON
const jsonParser = bodyParser.json();
// Usando o jsonParser como middleware para todas as rotas
app.use(jsonParser);
const User = require('./models/User'); // Importe o modelo do usuário do seu projeto
const Messages = require('./models/Messages'); // Importe o modelo do usuário do seu projeto
const Chat = require('./models/Chat');

  

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});



app.get('/script.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'script.js'));
  });
  


  app.post('/login', (req, res) => { 
    var user_id = req.body.user_id;
    var email = req.body.email;
    var username = req.body.username; 
    // console.log('Username:', username); 
    // console.log('email:', email);
    // console.log('user_id:', user_id);

    User.findOne({ where: { user_id: user_id } })
        .then((user) => {
            if (user) {
                // Usuário encontrado, retornar uma resposta de login bem-sucedido
                res.status(200).json({ success: true });     
                // Iniciar a sessão do usuário e definir um cookie de autenticação           


            } else {
                // Usuário não encontrado, realizar o cadastro
                User.create({ user_id, email, username })
                    .then((createdUser) => {
                        // Usuário cadastrado com sucesso, retornar uma resposta indicando a entrada
                        res.status(200).json({ success: true });
                        // Usuário cadastrado com sucesso, iniciar a sessão e definir um cookie de autenticação
                    })
                    .catch((error) => {
                        console.error('Erro ao criar usuário:', error);
                        res.status(500).json({ success: false, message: 'Erro ao criar usuário.' });
                    });
            }
        })
        .catch((error) => {
            console.error('Ocorreu um erro durante a autenticação:', error);
            res.status(500).json({ success: false, message: 'Ocorreu um erro durante a autenticação.' });
        });
});

app.get('/obter-mensagem-aleatoria', (req, res) => {
  // Consulta o banco de dados para obter uma mensagem aleatória
  Messages.findAll({
    attributes: ['message'],
    where: {
      is_system_message: 1,
      user_id: null
    },
    order: Sequelize.literal('RAND()'), // Ordenar aleatoriamente no MySQL
    limit: 1
  })
    .then((messages) => {
      if (messages.length > 0) {
        console.log('Mensagem aleatória:', messages[0].message);

        // Adicionar um atraso de 1 segundo antes de enviar a resposta
        setTimeout(() => {
          res.status(200).json({ success: true, message: messages[0].message });
        }, 1000); // 1000 milissegundos = 1 segundo
      } else {
        console.log('Nenhuma mensagem encontrada');
        res.status(404).json({ success: false, message: 'Nenhuma mensagem encontrada' });
      }
    })
    .catch((error) => {
      console.error('Erro ao obter as mensagens:', error);
      res.status(500).json({ success: false, message: 'Erro ao obter mensagem aleatória' });
    });
});


app.post('/criar-chat', async (req, res) => {
  try {
    // Extrair os dados necessários do corpo da requisição
    var user_id = req.body.user_id;
    var nome_chat =req.body.nome_chat;
    
    // Criar um novo chat no banco de dados
    var newChat = await Chat.create({
      user_id: user_id,
      nome_chat: nome_chat
    });
    console.log("criado chat com id: ", newChat.chat_id);
    // Retornar uma resposta de sucesso
    res.status(200).json({ success: true, message: 'Chat criado com sucesso',  chat_id: newChat.chat_id });
  } catch (error) {
    // Em caso de erro, retornar uma resposta de erro
    console.error('Erro ao criar o chat:', error);
    res.status(500).json({ success: false, message: 'Erro ao criar o chat' });
  }
});

app.get('/obter-chats', (req, res) => {
  // Extrair o ID do usuário dos parâmetros da requisição
  const  userId  = req.query.user_id;
  console.log("userid do app obter chat", userId);
  // Consultar o banco de dados para obter os chats do usuário
  Chat.findAll({
    where: {
      user_id: userId
    }
  })
    .then((chats) => {
      res.status(200).json({ success: true, chats });
    })
    .catch((error) => {
      console.error('Erro ao obter os chats do banco de dados:', error);
      res.status(500).json({ success: false, message: 'Erro ao obter os chats do usuário' });
    });
});

app.post('/salvar-mensagem', (req, res) => {
  // Extrair os dados necessários do corpo da requisição
  const { message, chat_id, user_id, is_system_message } = req.body;

  // Realizar a lógica para salvar a mensagem no banco de dados
  Messages.create({
    message: message,
    chat_id: chat_id,
    user_id: user_id,
    is_system_message: is_system_message
  })
    .then(() => {
      res.status(200).json({ success: true, message: 'Mensagem salva com sucesso' });
    })
    .catch((error) => {
      console.error('Erro ao salvar a mensagem:', error);
      res.status(500).json({ success: false, message: 'Erro ao salvar a mensagem' });
    });
});
  

app.get('/obter-conteudo-chat/:chatId', (req, res) => {
  const chatId = req.params.chatId;

  // Consultar o banco de dados para obter as mensagens do chat pelo ID, ordenando por message_date
  Messages.findAll({
    attributes: ['message', 'is_system_message'],
    where: {
      chat_id: chatId
    },
    order: [['message_date', 'ASC']] // Ordenar as mensagens pelo campo message_date em ordem ascendente (ASC)
  })
    .then((messages) => {
      if (messages.length > 0) {
        
        const conteudoChat = messages.map((message) => {
          return {
            message: message.message,
            is_system_message: message.is_system_message
          };
        });
        console.log("rota object message:", conteudoChat);
        res.status(200).json({ success: true, conteudo: conteudoChat });
      } else {
        console.log('Nenhuma mensagem encontrada para o chat');
        res.status(404).json({ success: false, message: 'Nenhuma mensagem encontrada para o chat' });
      }
    })
    .catch((error) => {
      console.error('Erro ao obter as mensagens do chat:', error);
      res.status(500).json({ success: false, message: 'Erro ao obter o conteúdo do chat' });
    });
});


app.get('/pegar-nome', (req, res) => {
  const user_id = req.query.user_id;

  // Use o método findOne do modelo User para buscar o usuário pelo user_id
  User.findOne({ where: { user_id: user_id } })
    .then((user) => {
      if (user) {
        // Usuário encontrado, retornar o username na resposta JSON
        res.status(200).json({ success: true, username: user.username });
      } else {
        // Usuário não encontrado, retornar uma resposta de erro
        res.status(404).json({ success: false, message: 'Usuário não encontrado' });
      }
    })
    .catch((error) => {
      // Erro ao buscar o usuário, retornar uma resposta de erro
      console.error('Erro ao buscar o usuário:', error);
      res.status(500).json({ success: false, message: 'Ocorreu um erro ao buscar o usuário' });
    });
});

app.post('/clear-convers', (req, res) => {
  const user_id = req.body.user_id;

  // Deletar todos os registros da tabela "messages" onde "user_id = user_id"
  Messages.destroy({ where: { user_id: user_id } })
    .then(() => {
      // Deletar todos os registros da tabela "chat" onde "user_id = user_id"
      return Chat.destroy({ where: { user_id: user_id } });
    })
    .then(() => {
      console.log('Conversas deletadas com sucesso');
      res.status(200).json({ success: true, message: 'Conversas deletadas com sucesso' });
    })
    .catch((error) => {
      console.error('Erro ao deletar conversas:', error);
      res.status(500).json({ success: false, message: 'Erro ao deletar conversas' });
    });
});

app.listen(8080, () => {
    console.log("servidor iniciado na porta 8080")
});
