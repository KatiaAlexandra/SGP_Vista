const URL = 'http://localhost:8080';
const token = localStorage.getItem('token');
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get("id"); // Obtener el parámetro `id` de la URL
let project={};
let task={};

let phaseList=[];


const findAllTasks = async (idProject, idPhase) => {
    try {
        const response = await fetch(`${URL}/api/task/${idProject}/${idPhase}`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error al obtener las tareas:", error);
        return [];
    }
};

const findTaskById = async id =>{
    await fetch(`${URL}/api/task/${id}`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "application/json",
            "Accept": "application/json"  
        }
        
    }).then(response => response.json()).then(response => {
        console.log(response);
        task = response.data;
    }).catch(console.log);   
}

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

const findAllPhases = async() =>{
    await fetch(`${URL}/api/phase`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "application/json",
            "Accept": "application/json"  
        }
        
    }).then(response => response.json()).then(response => {
        console.log(response);
        phaseList = response.data;
    }).catch(console.log);   
}

const loadCard = async () => {
    await findProjectById(projectId);
    document.getElementById('projectName').innerHTML = project.name;
    await findAllPhases();
    const cardbody = document.getElementById('cardBody');
    let content = '';

    for (const [index, phase] of phaseList.entries()) {
        if (phase.id === 5) {
            continue;
        }

        const tasks = await findAllTasks(projectId, phase.id);
        
        content += `
        <div class="mt-2">
            <strong>${phase.name}</strong>
            <div class="mt-2">
                ${tasks.map(task => `
                <div class="d-flex justify-content-between align-items-center">
                    <label class="mb-0">${task.description}</label>
                    <div class="ms-auto d-flex gap-2">
                        <button class="btn btn-outline-warning btn-sm">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-outline-success btn-sm" 
                        ${task.status ? "disabled" : ""}>
                            <i class="bi bi-check-square"></i>
                        </button>
                    </div>
                </div>`).join('')} <!-- Generar HTML dinámico para cada tarea -->
            </div>
        </div>`;
    }

    cardbody.innerHTML = content;
};


(async () => {
    await loadCard();
})();

 