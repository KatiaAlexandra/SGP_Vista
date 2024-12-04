const URL = 'http://localhost:8080';
const token = localStorage.getItem('token');
const user = localStorage.getItem('username');
const rol = localStorage.getItem('rol');

let employee = {};

const findEmployeeByUsername = async username =>{
    await fetch(`${URL}/api/employee/findEmployee/${username}`,{
        method:'GET',
        headers:{
            "Authorization":`Bearer ${token}`,
            "Content-Type":"application/json",
            "Accept":"application/json"
        }
    }).then(response =>response.json()).then(response=>{
        console.log(response);
        employee= response.data;
    }).catch(console.log)
}


const loadUserInfo = async ()=>{
    await findEmployeeByUsername(user);
    document.getElementById('name').value= employee.name;
    document.getElementById('surname').value= employee.surname;
    document.getElementById('lastname').value= employee.lastname;
    document.getElementById('email').value= employee.email;
    document.getElementById('new-username').value=employee.username;
}


(async()=>{
    if(rol!=4){
        window.location.replace('http://127.0.0.1:5501/index.html');
    }
    await loadUserInfo();
})()

const updateUserInfo = async () => {
    let updated = {
        id_Employee:employee.id_Employee,
        name:document.getElementById('name').value,
        surname: document.getElementById('surname').value,
        lastname: document.getElementById('lastname').value,
        email: document.getElementById('email').value,
        username: document.getElementById('new-username').value
    };

    await fetch(`${URL}/api/employee/updateUser`,{
        method: 'PUT',
        headers: {
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "application/json",
            "Accept": "application/json"  
        },
        body: JSON.stringify(updated)
    }).then(response => response.json()).then(async response=>{
        await loadUserInfo();
    }).catch(console.log);   
}


const changePassword = async () => {
    let updatedPassword = {
        id_Employee:employee.id_Employee,
        oldPassword:document.getElementById('current-password').value,
        newPassword: document.getElementById('new-password').value,
    };

    console.log(employee);
    await fetch(`${URL}/api/employee/changePassword`,{
        method: 'PUT',
        headers: {
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "application/json",
            "Accept": "application/json"  
        },
        body: JSON.stringify(updatedPassword)
    }).then(response => response.json()).then(async response=>{
        employee = {};
    }).catch(console.log);   
}