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

/*Botao fazer login com goole*/
function handleCredentialResponse(response) {
  const data = jwt_decode(response.credential)
  user_id = data.sub
  email = data.email
  username = data.name  
  console.log(data)
  console.log('o email é:',user_id)
  $.ajax({
    
    url: '/login',
    method: 'POST',
    contentType: 'application/json',
    data:JSON.stringify({user_id: user_id, email: email, username: username }),
   
    success: function(response) {
      console.log('Entrou ajax ');

      if (response.success) {
        // Login bem-sucedido, exibir o chat
        
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






}
window.onload = function () {
  google.accounts.id.initialize({
    client_id: "",
    callback: handleCredentialResponse
  });
  google.accounts.id.renderButton(
    document.getElementById("buttonDiv"),
    { theme: "filled_black", size: "large", shape:"pill"}  // customization attributes
  );
  google.accounts.id.prompt(); // also display the One Tap dialog
}


// loginForm.addEventListener('submit', function(event) {
//   event.preventDefault(); // Impede o envio do formulário
//   var usernameInput = document.querySelector('#username-input');
//   var passwordInput = document.querySelector('#password-input');
//   var username = usernameInput.value;
//   var password = passwordInput.value;

//   console.log('Username:', username); 
//   console.log('Password:', password);
//   /*ver o lance de cifrar a senha */
//   /*https://medium.com/collabcode/criptografando-e-descriptografando-dados-com-nodejs-f3f34a9390e4 */
//   $.ajax({
    
//     url: '/login',
//     method: 'POST',
//     contentType: 'application/json',
//     data:JSON.stringify({ username: username, password: password }),
    
//     success: function(response) {
//       console.log('Entrou ajax ');

//       if (response.success) {
//         // Login bem-sucedido, exibir o chat
//         loginForm.reset(); // Limpa o formulário de login
//         document.getElementById('login-screen').classList.add('hidden');
//         chatScreen.classList.remove('hidden');
//       } else {
//         // Login inválido, exibir mensagem de erro
//         alert(response.message);
//       }
//     },
//     error: function() {
//       alert('Ocorreu um erro durante a autenticação. Tente novamente');
//       //console.log(JSON.stringify(error));
//     }
//   });  
// });