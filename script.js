import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// --------------------------------------------------------
// ⚠️ PEGA AQUÍ TU CONFIGURACIÓN DE FIREBASE
// --------------------------------------------------------
const firebaseConfig = {
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
        let phasesArray = Object.values(data);
        renderApp(phasesArray);
    } else {
        phasesContainer.innerHTML = "<p style='text-align:center; color:white;'>Conectando al servidor...</p>";
    }
});

function formatDate(dateString) {
    // Convierte 2026-01-01 a texto bonito si quieres, o déjalo así.
    // Por simpleza, usaremos el string directo, pero se puede mejorar.
    return dateString; 
}

// Función para saber si la fecha actual está dentro del rango
function checkIfActive(start, end) {
    const today = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);
    // Ajustamos horas para evitar errores de zona horaria simples
    startDate.setHours(0,0,0,0);
    endDate.setHours(23,59,59,999);
    
    return today >= startDate && today <= endDate;
}

function renderApp(phases) {
    phasesContainer.innerHTML = '';
    badgesContainer.innerHTML = '';
    
    let totalTasks = 0;
    let completedTasksGlobal = 0;

    phases.forEach(phase => {
        if (!phase.tasks) phase.tasks = [];
        const completedCount = phase.tasks.filter(t => t.done).length;
        phase.isCompleted = (completedCount === phase.tasks.length && phase.tasks.length > 0);
        totalTasks += phase.tasks.length;
        completedTasksGlobal += completedCount;
    });

    const activePhases = phases.filter(p => !p.isCompleted).sort((a, b) => a.id - b.id);
    const completedPhases = phases.filter(p => p.isCompleted).sort((a, b) => a.id - b.id);
    const sortedPhases = [...activePhases, ...completedPhases];

    sortedPhases.forEach((phase) => {
        const phaseCompletedTasks = phase.tasks.filter(t => t.done).length;
        const phaseTotalTasks = phase.tasks.length;
        const phasePercent = phaseTotalTasks === 0 ? 0 : Math.round((phaseCompletedTasks / phaseTotalTasks) * 100);

        // Verificar si está ACTIVA (en curso)
        const isActive = checkIfActive(phase.startDate, phase.deadline);
        let activeBadgeHTML = "";
        if (isActive && !phase.isCompleted) {
            activeBadgeHTML = `<span class="status-badge active-phase-badge">● EN CURSO</span>`;
        }

        const card = document.createElement('div');
        card.classList.add('phase-card');
        if (phase.isCompleted) card.classList.add('completed');
        card.style.borderColor = phase.color;

        card.innerHTML = `
            <div class="mission-complete-stamp">★ MISSION COMPLETE ★</div>
            
            <div class="phase-header">
                <h3 class="phase-title" style="color:${phase.color}">
                    ${phase.name} ${activeBadgeHTML}
                </h3>
                
                <div class="date-row" style="color: #aaa; font-size: 14px; margin-bottom: 10px;">
                    <span>🚀 Inicio: ${phase.startDate}</span>
                    <span style="color:${phase.color}">${phasePercent}%</span>
                    <span style="color:#ff5555">🏁 Fin: ${phase.deadline}</span>
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
            
            // Si está hecha, agregamos clase para apagar el texto
            if (task.done) {
                taskItem.classList.add('done-task');
            }
            
            taskItem.onclick = () => toggleTask(phase.id, task.id, task.done);

            taskItem.innerHTML = `
                <div class="pixel-checkbox ${task.done ? 'checked' : ''}"></div>
                <div class="task-content">
                    <h4>${task.title}</h4>
                    <p>${task.desc}</p>
                </div>
            `;
            taskListContainer.appendChild(taskItem);
        });

        phasesContainer.appendChild(card);
    });

    // BADGES
    const numericPhases = [...phases].sort((a, b) => a.id - b.id);
    numericPhases.forEach(phase => {
        const badge = document.createElement('div');
        badge.classList.add('badge');
        if (phase.isCompleted) badge.classList.add('unlocked');
        badge.innerText = phase.badge;
        badgesContainer.appendChild(badge);
    });

    const globalPercent = totalTasks === 0 ? 0 : Math.round((completedTasksGlobal / totalTasks) * 100);
    globalProgressBar.style.width = `${globalPercent}%`;
    globalPercentText.innerText = `${globalPercent}%`;
}

window.toggleTask = function(phaseId, taskId, currentStatus) {
    const updates = {};
    updates[`phases/${phaseId}/tasks/${taskId}/done`] = !currentStatus;
    update(ref(db), updates);
};
