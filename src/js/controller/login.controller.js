let form = document.getElementById('loginForm');
let formButton = document.getElementById('formButton')

formButton.addEventListener('click', async event => {
    if(!form.checkValidity()) {
        event.preventDefault();
    } else {
        await login();
    }
    form.classList.add('was-validated');
});

const login = async() => {
    let dto = {
        password: document.getElementById('password').value,
            user: document.getElementById('username').value
    }

    //----BLOQUES DE UNA PETICION FETCH----

    //1.- BLOQUE CONFIGURACION FETCH
    await fetch('http://localhost:8080/auth', {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dto)
        //2.- BLOQUE TRANSFORMACION A JSON
    }).then(response => response.json())./*3.- BLOQUE MANIPULACIÓN*/then(response => {
       localStorage.setItem('token', response.data);//4.- BLOQUE DE ERRORES 
       window.location.replace('http://127.0.0.1:5501/src/view/MASTER/empleados.html');
    }).catch(console.log);
}