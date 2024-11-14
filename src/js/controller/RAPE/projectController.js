    const URL = 'http://localhost:8080';

    let projectList = {};
    let project = {};
    let employee = {};
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
                                <button class="btn btn-outline-warning" onclick = "loadProject(${item.id_project})" data-bs-target="#updateModal" data-bs-toggle="modal"><i class="bi bi-pencil-square"></i></button>
                                <button class="btn btn-outline-primary" onclick = "findEmployeeById(${item.id_Employee})" data-bs-target="#deleteModal" data-bs-toggle="modal"><i class="bi bi-check2-square"></i></button>
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
            rapeList, rdList, apList=null;
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

    const findEmployeeById = async id =>{
        await fetch(`${URL}/api/employee/${id}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
            
        }).then(response => response.json()).then(response => {
            console.log(response);
            employee=response.data;
        }).catch(console.log);   
    }

    const loadData = async () => {
       
            await findAllEmployees(2); 
            await findAllEmployees(3); 
            await findAllEmployees(4); 
        
        const rapeSelectRegister = document.getElementById("employeeListRape");
        const rdSelectRegister = document.getElementById("employeeListRd");
        const apSelectRegister= document.querySelectorAll('.employee-ap');
        
        const rapeSelectUpdate = document.getElementById("u_employeeListRape");
        const rdSelectUpdate = document.getElementById("u_employeeListRd");
        const apSelectUpdate= document.querySelectorAll('.u-employee-ap');
    
        let apContent = '';
        if (apList.length === 0) {
            apContent = `<option>No hay analistas programadores disponibles</option>`;
        } else if(apList.length<4){
            apContent = `<option>No suficientes analistas programadores</option>`;
        }else{
            apList.forEach(item => {
                apContent += `<option value="${item.id_Employee}">${item.name}</option>`;
            });
        }
    
        apSelectRegister.forEach(select => {
            select.innerHTML = apContent;
        });

        apSelectUpdate.forEach(select => {
            select.innerHTML = apContent;
        });
        
    
      
        let rdContent = '';
        if (rdList.length === 0) {
            rdContent = `<option>No hay responsables de desarrollo disponibles</option>`;
        } else {
            rdList.forEach(item => {
                rdContent += `<option value="${item.id_Employee}">${item.name}</option>`;
            });
        }
        rdSelectRegister.innerHTML = rdContent;
        rdSelectUpdate.innerHTML = rdContent;
    
      
        let rapeContent = '';
        if (rapeList.length === 0) {
            rapeContent = `<option>No hay responsables del proyecto disponibles</option>`;
        } else {
            rapeList.forEach(item => {
                rapeContent += `<option value="${item.id_Employee}">${item.name}</option>`;
            });
        }
        rapeSelectRegister.innerHTML = rapeContent;
        rapeSelectUpdate.innerHTML = rapeContent;
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

    const loadProject = async id => {
        await findProjectById(id);
        await loadData();
    
        document.getElementById('id').value = id;
        document.getElementById('u_name').value = project.name;
        document.getElementById('u_identifier').value = project.identifier;
        document.getElementById('u_estimatedDate').value = project.estimatedDate;
        await findEmployeeById(project.employee[0].id_Employee);
        document.getElementById('u_employeeListRape').value=employee.id_Employee;
    
        if (project.employee && project.employee.length > 0) {
            for (let i = 1; i < project.employee.length; i++) {
                let projectEmployee = project.employee[i];
                await findEmployeeById(projectEmployee.id_Employee);

                if (employee && employee.name && employee.id_Employee) {
                    let option = new Option(employee.name, employee.id_Employee, true, true);
                    switch(i) {
                        case 1:
                            let rdSelect = document.getElementById('u_employeeListRd');
                            if (rdSelect) {
                                rdSelect.add(option, undefined);
                            } else {
                                console.warn("Elemento 'u_employeeListRd' no encontrado.");
                            }
                            break;
                        default:
                            const apSelectors = [
                                document.getElementById('u_employeeListAp1'),
                                document.getElementById('u_employeeListAp2'),
                                document.getElementById('u_employeeListAp3'),
                                document.getElementById('u_employeeListAp4')
                            ];
                            const apIndex = i - 2;
                            if (apSelectors[apIndex]) {
                                apSelectors[apIndex].add(option, undefined);
                            } else {
                                console.warn(`Elemento 'u_employeeListAp${apIndex + 1}' no encontrado.`);
                            }
                            break;
                    }
                } else {
                    console.warn(`EmpData no tiene los datos esperados para el ID: ${employee.id_Employee}`);
                }
            }
        } else {
            console.log("No se encontraron empleados asignados al proyecto.");
        }
    };

    const updateProject = async () => {
        let form = document.getElementById("updateForm")
        let updated = {
            id:document.getElementById('id').value,
            name: document.getElementById('u_name').value,
            identifier: document.getElementById('u_identifier').value,
            estimatedDate: document.getElementById('u_estimatedDate').value,
            employees:[
                { id: parseInt(document.getElementById('u_employeeListRape').value) },
                { id: parseInt(document.getElementById('u_employeeListRd').value)},
                { id: parseInt(document.getElementById('u_employeeListAp1').value)},
                { id: parseInt(document.getElementById('u_employeeListAp2').value)},
                { id: parseInt(document.getElementById('u_employeeListAp3').value)},
                { id: parseInt(document.getElementById('u_employeeListAp4').value)}]
        };

        await fetch(`${URL}/api/project`,{
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(updated)
        }).then(response => response.json()).then(async response=>{
            console.log(project);
            project = {};
            await loadTable();
            form.reset();
        }).catch(console.log);   
    }
    