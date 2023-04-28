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
