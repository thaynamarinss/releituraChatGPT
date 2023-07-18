/* Esconder/mostrar a sidebar */
var btn_bar = document.querySelector('#sidebar-toggle');
var sidebar = document.querySelector('#sidebar');
btn_bar.addEventListener('click', function(){
    if(sidebar.style.display === 'flex'){
        sidebar.style.display = 'none';
    }else{
        sidebar.style.display = 'flex';
    }

});

/* examples principal */
function updatePlaceholder(text) {
  const messageInput = document.getElementById("message-input");
  messageInput.textContent = text;
}


 /* Esconder/mostrar opçoes do usuario */

var btn_user = document.querySelector('#btn-profile');
var op_user = document.querySelector('.user-options');
btn_user.addEventListener('click', function(){
    if(op_user.style.display === 'none'){
        op_user.style.display = 'block';
    }else{
        op_user.style.display = 'none';
    }

});   



/*Esconder e mostrar tela de login*/

var loginForm = document.querySelector('#login-form');
var chatScreen = document.querySelector('#chat-screen');
var user_id = null;
var profile_pic = null;
/*Botao fazer login com goole*/
function handleCredentialResponse(response) {
  const data = jwt_decode(response.credential);
 // console.log(data);
  user_id = data.sub;
  email = data.email;
  username = data.name; 
  profile_pic = data.picture;  
  console.log('profile_pic',profile_pic);
 
  $.ajax({
    
    url: '/login',
    method: 'POST',
    contentType: 'application/json',
    data:JSON.stringify({user_id: user_id, email: email, username: username }),
   
    success: function(response) {
      // Chamar a função para obter os chats do usuário assim que a página for carregada
      obterChatsDoUsuario(user_id);
      if (response.success) {
        sessionStorage.setItem('user_id_sessionstorage', user_id);
        sessionStorage.setItem('profile_pic_sessionstorage', profile_pic);
        // Login bem-sucedido, exibir o chat
      
        document.getElementById('login-screen').classList.add('hidden');
        chatScreen.classList.remove('hidden');
        pegar_nomeUser(); 
      } else {
        // Login inválido, exibir mensagem de erro
        alert(response.message);
      }
    },
    error: function() {
      alert('Ocorreu um erro durante a autenticação. Tente novamente');
      //console.log(JSON.stringify(error));
    }
  }); 
}

window.onload = function() { 

  // Verifica se o usuário já está logado (se o cookie 'user_id' já existe) 
 //sessionStorage (permanece ate fechar a aba)
 user_id = sessionStorage.getItem('user_id_sessionstorage');
 profile_pic = sessionStorage.getItem('profile_pic_sessionstorage');
 console.log("user id on load", sessionStorage.getItem('user_id_sessionstorage')) ;
 if ( user_id != null) {
    // Caso o cookie 'user_id_cookie' exista, o usuário já está logado,
    // então exiba o chat imediatamente, evitando a tela de login 
    document.getElementById('login-screen').classList.add('hidden');
    chatScreen.classList.remove('hidden');
    pegar_nomeUser(); 
    obterChatsDoUsuario(user_id);
  } else {
    // Caso o cookie 'user_id_cookie' não exista, o usuário não está logado,
    // então exiba a tela de login e o botão para fazer login com o Google
      google.accounts.id.initialize({
        client_id: "",
        callback: handleCredentialResponse
      });
      google.accounts.id.renderButton(
        document.getElementById("buttonDiv"),
        { theme: "filled_black", size: "large", shape: "pill" } // customization attributes
      );
      google.accounts.id.prompt(); // also display the One Tap dialog
  }
 
};

function Sair_user(){
  sessionStorage.removeItem('user_id_sessionstorage');
  sessionStorage.removeItem('profile_pic_sessionstorage');
  location.reload();
}

function pegar_nomeUser(){

  $.ajax({
    url: '/pegar-nome',
    method: 'GET',
    data: { user_id: user_id },
    success: function(response) {
      // Verificar se a requisição foi bem-sucedida
      if (response.success) {
        const words = response.username.split(' ');
        console.log("words get nome", words);
        // Selecione o elemento da imagem pelo ID "profile-image"
        const imagemPerfil = document.getElementById("profile-image");
        // Atribua o valor da URL da imagem ao atributo src
        imagemPerfil.src = profile_pic;
        if(words.length >=2){
          // Se tiver pelo menos duas palavras, pegar as duas primeiras (índices 0 e 1)
          const firstName = words[0];
          const lastName = words[1];
          // Montar o nome com as duas primeiras palavras
          const name = firstName + ' ' + lastName;
          // Atualizar o elemento com o nome
          document.getElementById("username").textContent = name;       
          
        } else {
          // Se tiver apenas uma palavra ou nenhuma, usar o nome completo do username
          document.getElementById("username").textContent = response.username;
        }

        console.log('requisição de nome sucedida');
      } else {
        console.error('Erro ao pegar username');
      }
    },
    error: function() {
      console.error('Ocorreu um erro durante a requisição do nome.');      
    }
  });  
  
}

function clear_Convers() {
  //const user_id = user_id;
  $.ajax({
    url: '/clear-convers',
    method: 'POST',
    contentType: 'application/json',
    data:JSON.stringify({  user_id: user_id }),
    success: function(response) {
      // Verificar se a requisição foi bem-sucedida
      if (response.success) {
        console.log('Conversas deletadas com sucesso');
        obterChatsDoUsuario(user_id);
      } else {
        console.error('Erro ao deletar conversas:', response.message);
      }
    },
    error: function() {
      console.error('Ocorreu um erro ao deletar as conversas.');
    }
  });
}


// Enviar mensagens do usuario e do sistema para tela

    // Captura os elementos do HTML 
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const chatContainer = document.getElementById('play-chat'); // Div onde o chat será exibido play-chat?   
    sendButton.addEventListener('click', sendMessage);
    var chatID = null;

  function newChat(){
    chatContainer.innerHTML = ''; // Limpar o conteúdo do elemento "play-chat"    
    chatContainer.classList.add('hidden');
    document.getElementById('sections').classList.remove('hidden');

  }


    function criarChat(message) {
      return new Promise((resolve, reject) => {
        
       // console.log("user criar chat user id:", user_id);
        nome_chat = message; // Substitua pelo nome do chat real
    
        // Fazer uma requisição AJAX para criar o chat
        $.ajax({
          url: '/criar-chat',
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({ user_id: user_id, nome_chat: nome_chat }),
          success: function(response) {
            // Verificar se a requisição foi bem-sucedida
            if (response.success) {
              chatID = response.chat_id;
              console.log('Chat criado com sucesso');
              resolve(); 
            } else {
              console.error('Erro ao criar o chat:', response.message);
              reject(); 
            }
          },
          error: function() {
            console.error('Ocorreu um erro durante a criação do chat.');
            reject(); 
          }
        });
      });
    }
    
    function exibirConteudoDoChat(chatId) {
      // Fazer uma requisição AJAX para o servidor para obter o conteúdo do chat pelo ID
      $.ajax({
        url: `/obter-conteudo-chat/${chatId}`, 
        method: 'GET',
        success: function (response) {
          // Verificar se a requisição foi bem-sucedida
          if (response.success) {
            chatID = chatId;
            newChat() //limpar tudo antes de exibir garante que vai estar na tela "inicial" antes de exibir outro chat
            document.getElementById('sections').classList.add('hidden');
            chatContainer.classList.remove('hidden');
            const conteudoDoChat = response.conteudo; // Conteúdo do chat obtido do servidor           

            // Iterar sobre as mensagens do chat e exibi-las nas divs apropriadas
            conteudoDoChat.forEach((messageObj) => {
              console.log('objeto', messageObj);
              const messageElement = document.createElement('p');
              messageElement.textContent = messageObj.message;
              
              if (messageObj.is_system_message == 1){   
                const systemdiv = document.createElement('div');
                systemdiv.className = 'system-message';
                systemdiv.appendChild(messageElement);
                const imagem = document.createElement('img');
                imagem.src = "images/bola_cristal.png";
                systemdiv.appendChild(imagem);
                chatContainer.appendChild(systemdiv);
              }else{
                //caso de mensagem ser do usuario        
                const userdiv = document.createElement('div');
                userdiv.className = 'user-message';     
                const imagem = document.createElement('img');
                imagem.src = profile_pic;
                userdiv.appendChild(imagem);
                userdiv.appendChild(messageElement);
                chatContainer.appendChild(userdiv);
              }             
    
            });
          } else {
            console.error('Erro ao obter o conteúdo do chat do servidor:', response.message);
          }
        },
        error: function () {
          console.error('Ocorreu um erro durante a requisição do conteúdo do chat.');
        }
      });
    }
    

// Função para exibir os chats do usuário na lista

function exibirChats(chats) {
  const ulElement = document.querySelector('#old-chats ul');
  ulElement.innerHTML = ''; // Limpar a lista antes de atualizar os chats

  chats.forEach((chat) => {
    const liElement = document.createElement('li');
    const aElement = document.createElement('a');
    aElement.href = '#';
    aElement.textContent = chat.nome_chat;
    // Adicionar o evento de clique para cada chat na lista
    aElement.addEventListener('click', function() {
      exibirConteudoDoChat(chat.chat_id); // Chamada da função que exibe o conteúdo do chat
    });
    liElement.appendChild(aElement);
    ulElement.appendChild(liElement);
  });
}

// Função para obter os chats do usuário
function obterChatsDoUsuario(user_id) {
  // Fazer uma requisição AJAX para o servidor 
  $.ajax({
    url: '/obter-chats', // Rota no servidor para obter os chats
    method: 'GET',   
    data:{ user_id: user_id },
    
    success: function(response) {
      // Verificar se a requisição foi bem-sucedida
      if (response.success) {
        const chats = response.chats; // Chats obtidos do servidor
        exibirChats(chats); // Atualizar a lista de chats no HTML
      } else {
        console.error('Erro ao obter os chats do servidor:', response.message);
      }
    },
    error: function() {
      console.error('Ocorreu um erro durante a requisição dos chats.');
    }
  });
}

var mensagemAleatoria = null;
// Função para exibir uma mensagem aleatória do banco de dados
function exibirMensagemAleatoria() {
  return new Promise((resolve, reject) => {
    // Fazer uma requisição AJAX para o servidor
    $.ajax({
      url: '/obter-mensagem-aleatoria', // Rota no servidor para obter uma mensagem aleatória
      method: 'GET',
      success: function(response) {
        // Verificar se a requisição foi bem-sucedida
        if (response.success) {
          // Criar um elemento de parágrafo para exibir a mensagem
          const messageElement = document.createElement('p');
          messageElement.textContent = response.message; // A mensagem recebida do servidor
          mensagemAleatoria = response.message;
          const systemdiv = document.createElement('div');
          systemdiv.className = 'system-message';

          systemdiv.appendChild(messageElement);
          const imagem = document.createElement('img');
          imagem.src = "images/bola_cristal.png";
          systemdiv.appendChild(imagem);
          chatContainer.appendChild(systemdiv);           
          resolve(response.message);
        } else {
          // Exibir uma mensagem de erro, caso necessário
          console.error('Erro ao obter mensagem do servidor:', response.message);
          
          reject(new Error('Erro ao obter mensagem do servidor'));
        }
      },
      error: function() {
        // Exibir uma mensagem de erro, caso ocorra um erro na requisição
        console.error('Ocorreu um erro durante a requisição da mensagem.');
       
        reject(new Error('Erro na requisição da mensagem'));
      }
    });
  });
}

function salvarMensagemBD(chatId,message,user_id, is_system_message) {
  // Fazer uma requisição AJAX para salvar a mensagem no banco de dados
  $.ajax({
    url: '/salvar-mensagem',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ message: message, chat_id: chatId, user_id:user_id, is_system_message: is_system_message }),
    success: function(response) {
      // Verificar se a requisição foi bem-sucedida
      if (response.success) {
        console.log('Mensagem salva com sucesso');
      } else {
        console.error('Erro ao salvar a mensagem:', response.message);
      }
    },
    error: function() {
      console.error('Ocorreu um erro ao salvar a mensagem.');
    }
  });
}
    
    
    // Função para enviar a mensagem
    function sendMessage() {
        const message = messageInput.value.trim(); // Obtém o valor da textarea e remove espaços em branco extras

        if (message !== '') {
            // Cria um novo elemento de parágrafo para exibir a mensagem
            document.getElementById('sections').classList.add('hidden');
            chatContainer.classList.remove('hidden');
            const messageElement = document.createElement('p');
            messageElement.textContent = message;
            // Adiciona o elemento de mensagem ao chatContainer
            
            //mensagem do usuario
            const userdiv = document.createElement('div');
            userdiv.className = 'user-message';     
            const imagem = document.createElement('img');
            imagem.src = profile_pic;
            userdiv.appendChild(imagem);
            userdiv.appendChild(messageElement);
            chatContainer.appendChild(userdiv);//div play-chat
            
            // Limpa o valor da textarea
            messageInput.value = '';

            // Verificar se é a primeira mensagem enviada pelo usuário
            if (chatContainer.childElementCount === 1) {
              criarChat(message)
                .then(() => {
                  salvarMensagemBD(chatID, message, user_id,false);
                  obterChatsDoUsuario(user_id);
                })
                .catch(() => {
                  console.error('Erro ao criar o chat');
                });
            } else {
              salvarMensagemBD(chatID, message, user_id, false);
            }        
            
             //pegar mensagem no banco de dados e exibir toda apos o usuario mandar mensagem
             // Chamar a função para exibir a mensagem aleatória do banco de dados
             console.log("mensagemAleato", mensagemAleatoria);
             exibirMensagemAleatoria()
              .then(()=>{
                salvarMensagemBD(chatID,mensagemAleatoria,user_id,true);
              })
              .catch(()=>{
                console.error('Erro ao exibir mensagem aleatoria');
              })
          
           

        }
    }

