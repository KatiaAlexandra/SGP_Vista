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

const findAllPhases = async () => {
    try {
        const response = await fetch(`${URL}/api/phase`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
            }
        });

        if (response.ok) {
            const result = await response.json();
            phaseList = result.data;

            // Llenar el select con las fases
            const select = document.getElementById('phaseList');
            select.innerHTML = ''; // Limpiar opciones previas

            phaseList.forEach(phase => {
                const option = document.createElement('option');
                option.value = phase.id;
                option.textContent = phase.name;
                select.appendChild(option);
            });
        } else {
            console.error("Error al obtener las fases:", await response.text());
        }
    } catch (error) {
        console.error("Error al obtener las fases:", error);
    }
};

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
                        <button onclick="loadTask(${task.id})" onclick="loadTask(${task.phase.id})" data-bs-toggle="modal" data-bs-target="#updateModal" class="btn btn-outline-warning btn-sm">
                            <i class="bi bi-pencil" ></i>
                        </button>
                        <button onclick="changeTaskStatus(${task.id})" class="btn btn-outline-success btn-sm">
                            <i class="bi bi-check-circle"></i> Cambiar Estado
                        </button>
                    </div>
                </div>`).join('')} <!-- Generar HTML dinámico para cada tarea -->
            </div>
        </div>`;
    }

    cardbody.innerHTML = content;
};


(async () => {
    if(rol!=3){
        window.location.replace('http://127.0.0.1:5501/index.html');
    }
    await loadCard();
})();

const saveTask = async () => {
    const form = document.getElementById("taskForm");

    // Construir el objeto `task`
    task = {
        description: document.getElementById('description').value,
        phase: { id: parseInt(document.getElementById('phaseList').value) },
        project: { id: parseInt(projectId) } // Incluimos el id del proyecto
    };

    try {
        const response = await fetch(`${URL}/api/task`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(task),
        });

        if (response.ok) {
            const result = await response.json();
            console.log("Tarea guardada:", result);

            // Recargar las tarjetas con las tareas
            await loadCard();

            // Limpiar el formulario
            form.reset();

            // Cerrar el modal (opcional)
            const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
            modal.hide();
        } else {
            console.error("Error al guardar la tarea:", await response.text());
        }
    } catch (error) {
        console.error("Error al guardar la tarea:", error);
    }
};

// Asignar el evento de envío del formulario
document.getElementById("taskForm").addEventListener("submit", (e) => {
    e.preventDefault();
    saveTask();
});

const loadTask = async (taskId) => {
    // Obtener los datos de la tarea por ID
    await findTaskById(taskId);

    // Verificar si la tarea fue encontrada
    if (!task) {
        console.error("No se encontró la tarea con ID:", taskId);
        return;
    }

    // Asignar valores al formulario de actualización
    document.getElementById('taskId').value = taskId; // Asignar el ID de la tarea
    document.getElementById('u_description').value = task.description; // Asignar la descripción de la tarea

    // Guardar el ID de la fase en una variable global para usarlo al actualizar
    window.selectedPhaseId = task.phase ? task.phase.id : null;

    // Mostrar la fase de la tarea en el formulario (no editable)
    const phaseSpan = document.getElementById('u_phase');
    if (task.phase && task.phase.name) {
        phaseSpan.textContent = task.phase.name; // Muestra el nombre de la fase
    } else {
        phaseSpan.textContent = "Sin fase asociada"; // Muestra un mensaje si no hay fase asociada
    }
};

const updateTask = async () => {
    let form = document.getElementById("updateForm");

    const taskId = document.getElementById('taskId');
    const description = document.getElementById('u_description');
    
    // Verificar que los elementos existan antes de intentar acceder a sus valores
    if (!taskId || !description || window.selectedPhaseId === undefined) {
        console.error("Faltan elementos en el formulario o el ID de la fase no está disponible.");
        return;
    }

    // Obtener los valores
    const taskIdValue = taskId.value;
    const descriptionValue = description.value;
    const phaseId = window.selectedPhaseId; // Obtener el ID de la fase desde la variable global

    // Validar que los datos sean correctos
    if (!taskIdValue || !descriptionValue || !phaseId) {
        alert("Debe completar todos los campos.");
        return;
    }

    let updatedTask = {
        id: taskIdValue,
        description: descriptionValue,
        phase: { id: phaseId },  // Incluir el ID de la fase en el objeto
        project: { id: parseInt(projectId) }
    };

    try {
        const response = await fetch(`${URL}/api/task`, {
            method: 'PUT',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(updatedTask)
        });

        if (response.ok) {
            console.log("Tarea actualizada con éxito");

            // Cerrar el modal sin usar jQuery
            let modal = new bootstrap.Modal(document.getElementById('updateModal'));
            modal.hide();

            await loadCard(); // Recargar las tarjetas de tareas
            form.reset(); // Limpiar el formulario
        } else {
            console.error("Error al actualizar la tarea:", await response.text());
        }
    } catch (error) {
        console.error("Error al actualizar la tarea:", error);
    }
};

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
