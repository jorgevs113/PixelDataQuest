import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// --------------------------------------------------------
// ⚠️ PEGA AQUÍ TU CONFIGURACIÓN DE FIREBASE
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
        phasesContainer.innerHTML = "<p style='text-align:center; color:white;'>Cargando datos...</p>";
    }
});

function checkIfActive(start, end) {
    const today = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);
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

    // Ordenar
    const activePhases = phases.filter(p => !p.isCompleted).sort((a, b) => a.id - b.id);
    const completedPhases = phases.filter(p => p.isCompleted).sort((a, b) => a.id - b.id);
    const sortedPhases = [...activePhases, ...completedPhases];

    sortedPhases.forEach((phase) => {
        const phaseCompletedTasks = phase.tasks.filter(t => t.done).length;
        const phaseTotalTasks = phase.tasks.length;
        const phasePercent = phaseTotalTasks === 0 ? 0 : Math.round((phaseCompletedTasks / phaseTotalTasks) * 100);

        const isActive = checkIfActive(phase.startDate, phase.deadline);
        let activeBadgeHTML = "";
        if (isActive && !phase.isCompleted) {
            activeBadgeHTML = `<span class="status-badge active-phase-badge">● EN CURSO</span>`;
        }

        const card = document.createElement('div');
        card.classList.add('phase-card');
        
        // AGREGAMOS ID PARA NAVEGACIÓN
        card.id = `phase-${phase.id}`; 
        
        if (phase.isCompleted) card.classList.add('completed');
        card.style.borderColor = phase.color;

        card.innerHTML = `
            <div class="mission-complete-stamp">★ NIVEL COMPLETADO ★</div>
            
            <div class="phase-header">
                <h3 class="phase-title" style="color:${phase.color}">
                    ${phase.name} ${activeBadgeHTML}
                </h3>
                
                <div class="level-meta-box">
                    <p><strong>🎯 META:</strong> ${phase.goal}</p>
                    <p><strong>💻 SOFTWARE:</strong> ${phase.software}</p>
                    <p><strong>🎓 CURSOS:</strong> ${phase.resources}</p>
                </div>

                <div class="date-row">
                    <span>📅 ${phase.startDate} - ${phase.deadline}</span>
                    <span style="color:${phase.color}">${phasePercent}%</span>
                </div>

                <div class="progress-bar-container" style="margin:10px 0; height:15px; border-width:1px;">
                    <div class="progress-fill" style="width: ${phasePercent}%; background-color: ${phase.color}"></div>
                </div>
            </div>

            <div class="tasks-list"></div>
        `;

        const taskListContainer = card.querySelector('.tasks-list');
        let currentMonth = "";

        phase.tasks.forEach((task) => {
            if (task.month !== currentMonth) {
                const monthHeader = document.createElement('div');
                monthHeader.classList.add('month-separator');
                monthHeader.innerText = task.month;
                monthHeader.style.color = phase.color;
                monthHeader.style.borderColor = phase.color;
                taskListContainer.appendChild(monthHeader);
                currentMonth = task.month;
            }

            const taskItem = document.createElement('div');
            taskItem.classList.add('task-item');
            if (task.done) taskItem.classList.add('done-task');
            
            taskItem.onclick = () => toggleTask(phase.id, task.id, task.done);

            taskItem.innerHTML = `
                <div class="pixel-checkbox ${task.done ? 'checked' : ''}"></div>
                <div class="task-content">
                    <h4>${task.title}</h4>
                    <div class="task-details">
                        <p class="task-instruction"><strong>🎮 Acción:</strong> ${task.instruction}</p>
                        <p class="task-objective"><strong>💡 Objetivo:</strong> ${task.objective}</p>
                    </div>
                </div>
            `;
            taskListContainer.appendChild(taskItem);
        });

        phasesContainer.appendChild(card);
    });

    // BADGES (TROFEOS) CON NAVEGACIÓN E IMÁGENES
    const numericPhases = [...phases].sort((a, b) => a.id - b.id);
    numericPhases.forEach(phase => {
        // Creamos un link para que al hacer clic baje a la tarjeta
        const anchor = document.createElement('a');
        anchor.href = `#phase-${phase.id}`; // Apunta al ID de la tarjeta
        anchor.classList.add('badge-link');

        const badge = document.createElement('div');
        badge.classList.add('badge');
        if (phase.isCompleted) badge.classList.add('unlocked');
        
        // AHORA USA IMÁGENES
        badge.innerHTML = `<img src="${phase.badge}" alt="Badge" class="badge-img">`;
        
        // Si está completado, borde brillante del color de la fase
        if (phase.isCompleted) {
            badge.style.borderColor = phase.color;
            badge.style.boxShadow = `0 0 15px ${phase.color}`;
        }

        anchor.appendChild(badge);
        badgesContainer.appendChild(anchor);
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

