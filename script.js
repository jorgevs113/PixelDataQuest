import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// --------------------------------------------------------
// ⚠️ PEGA AQUÍ TU CONFIGURACIÓN DE FIREBASE (IGNORE EL EJEMPLO)
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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const phasesContainer = document.getElementById('phases-container');
const badgesContainer = document.getElementById('badges-container');
const globalProgressBar = document.getElementById('global-progress');
const globalPercentText = document.getElementById('global-percent');

const dbRef = ref(db, 'phases');

onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        // Convertimos los datos a una lista
        let phasesArray = Object.values(data);
        renderApp(phasesArray);
    } else {
        phasesContainer.innerHTML = "<p style='text-align:center; color:white;'>Esperando datos del servidor...</p>";
    }
});

function renderApp(phases) {
    phasesContainer.innerHTML = '';
    badgesContainer.innerHTML = '';
    
    let totalTasks = 0;
    let completedTasksGlobal = 0;

    // 1. CALCULAR ESTADOS
    phases.forEach(phase => {
        if (!phase.tasks) phase.tasks = [];
        const completedCount = phase.tasks.filter(t => t.done).length;
        // Marcamos si está completa al 100%
        phase.isCompleted = (completedCount === phase.tasks.length && phase.tasks.length > 0);
        
        // Sumar al global
        totalTasks += phase.tasks.length;
        completedTasksGlobal += completedCount;
    });

    // 2. ORDENAMIENTO AGRESIVO (SEPARAR LISTAS)
    // Creamos dos listas separadas
    const activePhases = phases.filter(p => !p.isCompleted).sort((a, b) => a.id - b.id);
    const completedPhases = phases.filter(p => p.isCompleted).sort((a, b) => a.id - b.id);

    // Las unimos: Primero las activas, al final las completadas
    const sortedPhases = [...activePhases, ...completedPhases];

    // 3. DIBUJAR TARJETAS (Usamos la lista ya ordenada)
    sortedPhases.forEach((phase) => {
        const phaseCompletedTasks = phase.tasks.filter(t => t.done).length;
        const phaseTotalTasks = phase.tasks.length;
        const phasePercent = phaseTotalTasks === 0 ? 0 : Math.round((phaseCompletedTasks / phaseTotalTasks) * 100);

        const card = document.createElement('div');
        card.classList.add('phase-card');
        
        if (phase.isCompleted) {
            card.classList.add('completed');
        }

        card.style.borderColor = phase.color;

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

            <div class="tasks-list"></div>
        `;

        const taskListContainer = card.querySelector('.tasks-list');
        
        phase.tasks.forEach((task) => {
            const taskItem = document.createElement('div');
            taskItem.classList.add('task-item');
            
            // IMPORTANTE: Usamos phase.id para saber cuál actualizar en la BD
            taskItem.onclick = () => toggleTask(phase.id, task.id, task.done);

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
    });

    // 4. DIBUJAR TROFEOS (En orden numérico 1 al 5 siempre)
    const numericPhases = [...phases].sort((a, b) => a.id - b.id);
    numericPhases.forEach(phase => {
        const badge = document.createElement('div');
        badge.classList.add('badge');
        if (phase.isCompleted) badge.classList.add('unlocked');
        badge.innerText = phase.badge;
        badgesContainer.appendChild(badge);
    });

    // 5. ACTUALIZAR BARRA GLOBAL
    const globalPercent = totalTasks === 0 ? 0 : Math.round((completedTasksGlobal / totalTasks) * 100);
    globalProgressBar.style.width = `${globalPercent}%`;
    globalPercentText.innerText = `${globalPercent}%`;
}

// FUNCION GLOBAL PARA ACTUALIZAR
window.toggleTask = function(phaseId, taskId, currentStatus) {
    const updates = {};
    updates[`phases/${phaseId}/tasks/${taskId}/done`] = !currentStatus;
    update(ref(db), updates);
};
