    const URL = 'http://localhost:8080';
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const rol = localStorage.getItem('rol');

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
                            <td>${item.name}</td>
                            <td>${item.identifier}</td>
                            <td>${item.startDate}</td>
                            <td>${item.estimatedDate}</td>
                            <td>${item.finishDate==null? "Indeterminada":item.finishDate}</td>
                            <td>${item.status ? "Finalizado":"En proceso"}</td>
                            <td>${item.currentPhase}</td>
                        
                            <td class="text-center">
                                <button class="btn btn-outline-danger" onclick = "findProjectById(${item.id_project})" data-bs-target="#finishModal" data-bs-toggle="modal" 
                                ${item.currentPhase !== "Cierre" ? "disabled" : ""}><i class="bi bi-check2-square"></i></button>
                                <button class="btn btn-outline-primary" onclick="taskManage(${item.id_project})"><i class="bi bi-eye"></i></button>
                            </td>
                        </tr>`
        });
        tbody.innerHTML = content;
    }

    (async () =>{
        if(rol!=2){
            window.location.replace('http://127.0.0.1:5501/index.html');
        }
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

    const finishProject = async () => {
        console.log(project);
        await fetch(`${URL}/api/project/finish/${project.id_project}`,{
            method: 'PUT',
            headers: {
                "Authorization": `Bearer ${token}`, 
                "Content-Type": "application/json",
                "Accept": "application/json"  
            },
    
        }).then(response => response.json()).then(async response=>{
            console.log(response);
            project = {};
            await loadTable();
        }).catch(console.log);  
    
    }

    function taskManage(id){
        window.location.replace(`http://127.0.0.1:5501/src/view/RAPE/VisualizacionTarea.html?id=${id}`);
    }