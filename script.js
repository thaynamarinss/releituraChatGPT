
    console.log("Meu código está sendo executado dentro do bloco $(document).ready()!");

    var btn = document.querySelector('#sidebar-toggle');
    var sidebar = document.querySelector('#sidebar');

    btn.addEventListener('click', function(){
        if(sidebar.style.display === 'flex'){
            sidebar.style.display = 'none';
        }else{
            sidebar.style.display = 'flex';
        }

    });


    
