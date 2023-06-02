/*Express gerencia requisições/rotas */
const express = require('express');
const app = express();
const path = require('path');

const bodyParser = require('body-parser');
// Define o caminho para os arquivos estáticos
app.use(express.static(path.join(__dirname)));

// Middleware para fazer o parsing do corpo das requisições como JSON
const jsonParser = bodyParser.json();
// Usando o jsonParser como middleware para todas as rotas
app.use(jsonParser);

// app.use(express.json());
// app.use(jsonParser);

//const db = require('./models/config_db'); /*importando arquivo que faz ligação com o db */

const User = require('./models/User'); // Importe o modelo do usuário do seu projeto
console.log('linha 13 ', User);
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/script.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'script.js'));
  });
  
  console.log('linha 22 ');

app.post('/login', (req, res) => {
    console.log('blaaaaaaaaaaaaaaaaa');
    //const { username, password } = req.body;
    var username = req.body.username;
    var password = req.body.password;
    
    console.log('SE Username:', username); // Log de console para verificar se o username está sendo recebido corretamente
    console.log('SE Password:', password);
    
    User.findOne({ where: { username: username, password: password } })
        .then((user) => {
            if (user) {
                res.status(200).json({ success: true });
            } else {
                res.status(401).json({ success: false, message: 'Nome de usuário ou senha inválidos!' });
            }
        })
        .catch((error) => {
            console.error('Ocorreu um erro durante a autenticação:', error);
            res.status(500).json({ success: false, message: 'Ocorreu um erro durante a autenticação.' });
        });
});





app.listen(8080, () => {
    console.log("servidor iniciado na porta 8080")
});
