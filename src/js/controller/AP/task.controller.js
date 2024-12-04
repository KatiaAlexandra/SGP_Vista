const URL = 'http://localhost:8080';
const token = localStorage.getItem('token');
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get("id"); // Obtener el parámetro `id` de la URL
const rol = localStorage.getItem('rol');
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
    console.log(project);
    document.getElementById('projectName').innerHTML = project.name;

    await findAllPhases();

    for (const phase of phaseList) {
        const tasks = await findAllTasks(projectId, phase.id);
        const taskContainer = document.getElementById(`fase${phase.name}`);

        if (tasks.length > 0 && taskContainer) {
            let content = tasks.map(task => `
                <div class="task-card d-flex justify-content-between align-items-center">
                    <span>${task.description}</span>
                    <div class="task-buttons d-flex flex-column">
                        <!--<button onclick="loadTask(${task.id}, ${phase.id})" data-bs-toggle="modal" data-bs-target="#updateModal" class="btn btn-outline-primary btn-sm">
                            <i class="bi bi-pencil-square"></i>-->
                        </button>
                        <button onclick="changeTaskStatus(${task.id})" class="btn btn-outline-success btn-sm">
                            <i class="bi bi-check-circle"></i>
                        </button>
                    </div>
                </div>
            `).join('');
            taskContainer.innerHTML = content;
        }
    };
};



(async () => {
    if(rol!=4){
        window.location.replace('http://127.0.0.1:5501/index.html');
    }
    await loadCard();
})();

const changeTaskStatus = async (taskId) => {
    try {
        const response = await fetch(`${URL}/api/task/${taskId}`, {
            method: 'PUT',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        });

        if (response.ok) {
            console.log("Estado de la tarea cambiado con éxito.");
            await loadCard(); // Recargar las tareas en la interfaz
        } else {
            console.error("Error al cambiar el estado de la tarea:", await response.text());
        }
    } catch (error) {
        console.error("Error al cambiar el estado de la tarea:", error);
    }
};


 