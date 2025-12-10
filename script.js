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
    // Limpiamos SOLO badges
    badgesContainer.innerHTML = '';
    
    let totalTasks = 0;
    let completedTasksGlobal = 0;

    // 1. Cálculos
    phases.forEach(phase => {
        if (!phase.tasks) phase.tasks = [];
        const completedCount = phase.tasks.filter(t => t.done).length;
        phase.isCompleted = (completedCount === phase.tasks.length && phase.tasks.length > 0);
        totalTasks += phase.tasks.length;
        completedTasksGlobal += completedCount;
    });

    // 2. Ordenar
    const activePhases = phases.filter(p => !p.isCompleted).sort((a, b) => a.id - b.id);
    const completedPhases = phases.filter(p => p.isCompleted).sort((a, b) => a.id - b.id);
    const sortedPhases = [...activePhases, ...completedPhases];

    // 3. RENDERIZADO
    sortedPhases.forEach((phase) => {
        const phasePercent = phase.tasks.length === 0 ? 0 : Math.round((phase.tasks.filter(t => t.done).length / phase.tasks.length) * 100);
        const cardId = `phase-${phase.id}`;
        
        let card = document.getElementById(cardId);

        // --- CREACIÓN INICIAL (Si no existe) ---
        if (!card) {
            card = document.createElement('div');
            card.id = cardId;
            card.className = 'phase-card';
            card.style.borderColor = phase.color;
            
            const isActive = checkIfActive(phase.startDate, phase.deadline);
            let activeBadgeHTML = isActive && !phase.isCompleted ? `<span class="status-badge active-phase-badge">● EN CURSO</span>` : "";

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
                        <span class="percent-text" style="color:${phase.color}">0%</span>
                    </div>
                    <div class="progress-bar-container" style="margin:10px 0; height:15px; border-width:1px;">
                        <div class="progress-fill" style="width: 0%; background-color: ${phase.color}"></div>
                    </div>
                </div>
                <div class="tasks-list"></div>
            `;
            
            const taskListContainer = card.querySelector('.tasks-list');
            let currentMonth = "";
            phase.tasks.forEach((task) => {
                if (task.month !== currentMonth) {
                    const monthHeader = document.createElement('div');
                    monthHeader.className = 'month-separator';
                    monthHeader.innerText = task.month;
                    monthHeader.style.color = phase.color;
                    monthHeader.style.borderColor = phase.color;
                    taskListContainer.appendChild(monthHeader);
                    currentMonth = task.month;
                }
                const taskItem = document.createElement('div');
                taskItem.className = 'task-item';
                taskItem.id = `task-${phase.id}-${task.id}`;
                taskItem.onclick = () => toggleTask(phase.id, task.id, task.done);
                taskItem.innerHTML = `
                    <div class="pixel-checkbox"></div>
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
        }

        // --- ACTUALIZACIÓN (Siempre ocurre) ---
        
        phasesContainer.appendChild(card); // Reordenar sin borrar

        // Actualizar estilos completado
        if (phase.isCompleted) card.classList.add('completed');
        else card.classList.remove('completed');

        // --- CORRECCIÓN DE ANIMACIÓN ---
        const bar = card.querySelector('.progress-fill');
        const percentText = card.querySelector('.percent-text');
        
        // Solo actualizamos si el valor cambió para no reiniciar animaciones innecesariamente
        // Pero usamos setTimeout para asegurar que el navegador tenga tiempo de renderizar
        setTimeout(() => {
            if (bar.style.width !== `${phasePercent}%`) {
                bar.style.width = `${phasePercent}%`;
            }
            if(percentText) percentText.innerText = `${phasePercent}%`;
        }, 50);

        // Actualizar checkboxes
        phase.tasks.forEach(task => {
            const taskEl = document.getElementById(`task-${phase.id}-${task.id}`);
            if (taskEl) {
                const checkbox = taskEl.querySelector('.pixel-checkbox');
                if (task.done) {
                    taskEl.classList.add('done-task');
                    checkbox.classList.add('checked');
                } else {
                    taskEl.classList.remove('done-task');
                    checkbox.classList.remove('checked');
                }
                taskEl.onclick = () => toggleTask(phase.id, task.id, task.done);
            }
        });
    });

    // 4. BADGES
    const numericPhases = [...phases].sort((a, b) => a.id - b.id);
    numericPhases.forEach(phase => {
        const anchor = document.createElement('a');
        anchor.href = `#phase-${phase.id}`;
        anchor.classList.add('badge-link');
        const badge = document.createElement('div');
        badge.classList.add('badge');
        if (phase.isCompleted) badge.classList.add('unlocked');
        badge.innerHTML = `<img src="${phase.badge}" alt="Badge" class="badge-img">`;
        if (phase.isCompleted) {
            badge.style.borderColor = phase.color;
            badge.style.boxShadow = `0 0 15px ${phase.color}`;
        }
        anchor.appendChild(badge);
        badgesContainer.appendChild(anchor);
    });

    // 5. BARRA GLOBAL (Esta ya funcionaba bien)
    const globalPercent = totalTasks === 0 ? 0 : Math.round((completedTasksGlobal / totalTasks) * 100);
    // Usamos el mismo truco del timeout para asegurar suavidad
    setTimeout(() => {
        globalProgressBar.style.width = `${globalPercent}%`;
        globalPercentText.innerText = `${globalPercent}%`;
    }, 50);
}

window.toggleTask = function(phaseId, taskId, currentStatus) {
    const updates = {};
    updates[`phases/${phaseId}/tasks/${taskId}/done`] = !currentStatus;
    update(ref(db), updates);
};
