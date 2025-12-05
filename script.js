// Importamos las herramientas de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// --------------------------------------------------------
// ⚠️ IMPORTANTE: REEMPLAZA ESTO CON TU CÓDIGO DE FIREBASE
// --------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyAsc6sCTXDevRtwd-wa9uEksHng2syt9f0",
  authDomain: "pixeldataquest-jorge.firebaseapp.com",
  databaseURL: "https://pixeldataquest-jorge-default-rtdb.firebaseio.com",
  projectId: "pixeldataquest-jorge",
  storageBucket: "pixeldataquest-jorge.firebasestorage.app",
  messagingSenderId: "1017478767394",
  appId: "1:1017478767394:web:b9ecb4c50484e596757b7b"
};
// --------------------------------------------------------

// Iniciamos la conexión
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Referencias al HTML
const phasesContainer = document.getElementById('phases-container');
const badgesContainer = document.getElementById('badges-container');
const globalProgressBar = document.getElementById('global-progress');
const globalPercentText = document.getElementById('global-percent');

// ESCUCHAR CAMBIOS EN LA BASE DE DATOS
const dbRef = ref(db, 'phases');

onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        renderApp(data);
    } else {
        phasesContainer.innerHTML = "<p>¡Base de datos vacía! Importa el JSON.</p>";
    }
});

// FUNCIÓN PRINCIPAL: DIBUJAR TODO EN PANTALLA
function renderApp(phases) {
    phasesContainer.innerHTML = ''; // Limpiar pantalla
    badgesContainer.innerHTML = ''; // Limpiar trofeos
    
    let totalTasks = 0;
    let completedTasksGlobal = 0;

    phases.forEach((phase, phaseIndex) => {
        // 1. Calcular progreso de esta fase
        const phaseTotalTasks = phase.tasks.length;
        const phaseCompletedTasks = phase.tasks.filter(t => t.done).length;
        const phasePercent = Math.round((phaseCompletedTasks / phaseTotalTasks) * 100);

        // Sumar al global
        totalTasks += phaseTotalTasks;
        completedTasksGlobal += phaseCompletedTasks;

        // Verificar si la fase está completa
        const isPhaseComplete = phasePercent === 100;

        // 2. Crear el HTML de la Tarjeta
        const card = document.createElement('div');
        card.classList.add('phase-card');
        if (isPhaseComplete) card.classList.add('completed');
        card.style.borderColor = phase.color; // Borde del color de la fase

        // HTML INTERNO DE LA TARJETA
        card.innerHTML = `
            <div class="mission-complete-stamp">★ MISSION COMPLETE ★</div>
            
            <div class="phase-header">
                <h3 class="phase-title" style="color:${phase.color}">${phase.name}</h3>
                <div class="hud-row">
                    <span class="deadline-text" style="font-size:14px">📅 ${phase.deadline}</span>
                    <span>${phasePercent}%</span>
                </div>
                <div class="progress-bar-container" style="margin:0; height:15px; border-width:1px;">
                    <div class="progress-fill" style="width: ${phasePercent}%; background-color: ${phase.color}"></div>
                </div>
            </div>

            <div class="tasks-list">
                </div>
        `;

        // 3. Insertar las tareas dentro de la tarjeta
        const taskListContainer = card.querySelector('.tasks-list');
        
        phase.tasks.forEach((task, taskIndex) => {
            const taskItem = document.createElement('div');
            taskItem.classList.add('task-item');
            
            // Si hacemos click, cambiamos el estado
            taskItem.onclick = () => toggleTask(phaseIndex, taskIndex, task.done);

            taskItem.innerHTML = `
                <div class="pixel-checkbox ${task.done ? 'checked' : ''}"></div>
                <div class="task-content">
                    <h4 style="${task.done ? 'text-decoration:line-through; color:#555' : 'color:#FFF'}">${task.title}</h4>
                    <p>${task.desc}</p>
                </div>
            `;
            taskListContainer.appendChild(taskItem);
        });

        phasesContainer.appendChild(card);

        // 4. Crear el Trofeo (Badge)
        const badge = document.createElement('div');
        badge.classList.add('badge');
        if (isPhaseComplete) badge.classList.add('unlocked');
        badge.innerText = phase.badge;
        badgesContainer.appendChild(badge);
    });

    // 5. Actualizar Barra Global
    const globalPercent = Math.round((completedTasksGlobal / totalTasks) * 100);
    globalProgressBar.style.width = `${globalPercent}%`;
    globalPercentText.innerText = `${globalPercent}%`;
}

// FUNCIÓN PARA ACTUALIZAR FIREBASE AL HACER CLICK
window.toggleTask = function(phaseIndex, taskIndex, currentStatus) {
    const updates = {};
    // La ruta exacta en la BD es: phases/[numero_fase]/tasks/[numero_tarea]/done
    updates[`phases/${phaseIndex}/tasks/${taskIndex}/done`] = !currentStatus;
    
    update(ref(db), updates);
};
