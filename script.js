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

   

 /* Esconder/mostrar opçoes do usuario */

var btn_user = document.querySelector('#user-action');
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


loginForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Impede o envio do formulário
  var usernameInput = document.querySelector('#username-input');
  var passwordInput = document.querySelector('#password-input');
  var username = usernameInput.value;
  var password = passwordInput.value;

  console.log('Username:', username); 
  console.log('Password:', password);
  $.ajax({
    
    url: '/login',
    method: 'POST',
    contentType: 'application/json',
    data:JSON.stringify({ username: username, password: password }),
    
    success: function(response) {
      console.log('Entrou ajax ');

      if (response.success) {
        // Login bem-sucedido, exibir o chat
        loginForm.reset(); // Limpa o formulário de login
        document.getElementById('login-screen').classList.add('hidden');
        chatScreen.classList.remove('hidden');
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

  // User.findOne({ where: { username: username, password: password } })
  // .then(function(user) {
  //   if (user) {
  //     // Login bem-sucedido, exibir o chat
  //     loginForm.reset(); // Limpa o formulário de login
  //     document.getElementById('login-screen').classList.add('hidden');
  //     chatScreen.classList.remove('hidden');
  //   } else {
  //     // Login inválido, exibir mensagem de erro ou tomar outra ação
  //     alert('Nome de usuário ou senha inválidos!');
  //   }
  // })
  // .catch(function(error) {
  //   console.error('Ocorreu um erro durante a autenticação:', error);
  //   // Tratar o erro adequadamente
  // });



  
});



  // Aqui você pode adicionar lógica para validar o nome de usuário e senha
  // com suas regras de autenticação


   // Exemplo básico de validação (apenas para demonstração)
  // if (username === 'usuario' && password === 'senha') {
  //   // Login bem-sucedido, exibir o chat
  //   loginForm.reset(); // Limpa o formulário de login
  //   document.getElementById('login-screen').classList.add('hidden');
  //   chatScreen.classList.remove('hidden');
  // } else {
  //   // Login inválido, exibir mensagem de erro ou tomar outra ação
  //   alert('Nome de usuário ou senha inválidos!');
  // }
