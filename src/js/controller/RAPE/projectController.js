    const URL = 'http://localhost:8080';

    let projectList = {};
    let project = {};
    let apList = [];
    let rdList = [];
    let rapeList = [];

    const findAllProjects = async() => {
        await fetch(`${URL}/api/project`, {
            method: 'GET',
            headers: {
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
                                <button class="btn btn-outline-warning" onclick = "loadEmployee(${item.id_Employee})" data-bs-target="#updateModal" data-bs-toggle="modal"><i class="bi bi-pencil-square"></i></button>
                                <button class="btn btn-outline-danger" onclick = "findEmployeeById(${item.id_Employee})" data-bs-target="#deleteModal" data-bs-toggle="modal"><i class="bi bi-trash-fill"></i></button>
                            </td>
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
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
            
        }).then(response => response.json()).then(response => {
            console.log(response);
            project = response.data;
        }).catch(console.log);   
    }

    const findAllEmployees = async id => {
        await fetch(`${URL}/api/employee/rol/${id}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
            
        }).then(response => response.json()).then(response => {
            console.log(response);
            switch(id){
                case 2:
                    rapeList=response.data;
                    break;
                case 3:
                    rdList= response.data;
                    break;
                case 4:
                    apList=response.data;
                    break;
            }
        }).catch(console.log);
    }

    const loadData = async () => {
        await findAllEmployees(2);
        await findAllEmployees(3);
        await findAllEmployees(4);

        let rapeSelect = document.getElementById("employeeListRape");
        let rdSelect = document.getElementById("employeeListRd");
        let apSelect = document.getElementById("employeeListAp1");

        let content = '';
    
        if (apList.length === 0) {
            content = `<option>No hay analistas programadores disponibles</option>`;
        } else {
            apList.forEach(item => {
                content += `<option value="${item.id_Employee}">${item.name}</option>`;
            });
        }

        const selects = document.querySelectorAll('.employee-ap');
        selects.forEach(select => {
            select.innerHTML = content;
        });

        apSelect.innerHTML = content;

        content = '';

        if (rdList.length === 0) {
            content = `<option>No hay responsables de desarrollo disponibles</option>`;
        } else {
            rdList.forEach(item => {
                content += `<option value="${item.id_Employee}">${item.name}</option>`;
            });
        }

        rdSelect.innerHTML = content;

        content = '';

        if (rapeList.length === 0) {
            content = `<option>No hay responsables del proyecto disponibles</option>`;
        } else {
            rapeList.forEach(item => {
                content += `<option value="${item.id_Employee}">${item.name}</option>`;
            });
        }

        rapeSelect.innerHTML = content;
    };

   
    const saveProject = async () => {
        let form = document.getElementById("saveForm")
        project = {
            name: document.getElementById('name').value,
            identifier: document.getElementById('identifier').value,
            estimatedDate: document.getElementById('estimatedDate').value,
            employees:[
                { id: parseInt(document.getElementById('employeeListRape').value) },
                { id: parseInt(document.getElementById('employeeListRd').value)},
                { id: parseInt(document.getElementById('employeeListAp1').value)},
                { id: parseInt(document.getElementById('employeeListAp2').value)},
                { id: parseInt(document.getElementById('employeeListAp3').value)},
                { id: parseInt(document.getElementById('employeeListAp4').value)}]
        };

        await fetch(`${URL}/api/project`,{
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(project)
        }).then(response => response.json()).then(async response=>{
            console.log(project);
            project = {};
            await loadTable();
            form.reset();
        }).catch(console.log);   
    }


    