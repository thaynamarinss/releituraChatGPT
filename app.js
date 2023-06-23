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

//const db = require('./models/config_db'); /*importando arquivo que faz ligação com o db */
const User = require('./models/User'); // Importe o modelo do usuário do seu projeto


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
    //var password = req.body.password;
    console.log('Username:', username); 
    console.log('email:', email);
    console.log('user_id:', user_id);

    User.findOne({ where: { user_id: user_id } })
        .then((user) => {
            if (user) {
                // Usuário encontrado, retornar uma resposta de login bem-sucedido
                res.status(200).json({ success: true });
            } else {
                // Usuário não encontrado, realizar o cadastro
                User.create({ user_id, email, username })
                    .then(() => {
                        // Usuário cadastrado com sucesso, retornar uma resposta indicando a entrada
                        res.status(200).json({ success: true });
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


// app.post('/login', (req, res) => { 
//     var user_id = req.body.user_id;
//     var email = req.body.email;
//     var username = req.body.username;
//     var password = req.body.password;  //apagar  
//     //console.log('SE Username:', username); 
//     //console.log('SE Password:', password);
    
//     User.findOne({ where: { username: username, password: password } })
//         .then((user) => {
//             if (user) {
//                 res.status(200).json({ success: true });
//             } else {
//                 res.status(401).json({ success: false, message: 'Nome de usuário ou senha inválidos!' });
//             }
//         })
//         .catch((error) => {
//             console.error('Ocorreu um erro durante a autenticação:', error);
//             res.status(500).json({ success: false, message: 'Ocorreu um erro durante a autenticação.' });
//         });
// });




app.listen(8080, () => {
    console.log("servidor iniciado na porta 8080")
});
