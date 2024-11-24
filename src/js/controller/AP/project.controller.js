    const URL = 'http://localhost:8080';
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    let projectList = {};
    let project = {};
    let employee = {};
    let apList = [];
    let rdList = [];
    let rapeList = [];


    const findAllProjects = async() => {
        await fetch(`${URL}/api/project/user/${username}`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`, 
                "Content-Type": "application/json",
                "Accept": "application/json"  
            }
            
        }).then(response => response.json()).then(response => {
            console.log(response);
            projectList = response.data;
        }).catch(console.log);
    }

    const loadTable = async () =>{
        await findAllProjects();
        let tbody = document.getElementById('tbody');
        let content = '';
        
        projectList.forEach((item, index) => {
            content += `<tr>
                            <th scope="row">${index+1}</th>
                            <td><a href="VisualizacionTarea.html?id=${item.id_project}">${item.name}</a></td>
                            <td>${item.identifier}</td>
                            <td>${item.status ? "Finalizado":"En proceso"}</td>
                            <td>${item.currentPhase}</td>
                        </tr>`
        });
        tbody.innerHTML = content;
    }

    (async () =>{
        await loadTable();
    })()

    const findProjectById = async id =>{
        await fetch(`${URL}/api/project/${id}`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`, 
                "Content-Type": "application/json",
                "Accept": "application/json"  
            }
            
        }).then(response => response.json()).then(response => {
            console.log(response);
            project = response.data;
        }).catch(console.log);   
    }
