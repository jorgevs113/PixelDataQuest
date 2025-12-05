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
        // Convertimos el objeto/array de Firebase a un Array manipulable
        let phasesArray = Object.values(data);
        renderApp(phasesArray);
    } else {
        phasesContainer.innerHTML = "<p>Cargando datos...</p>";
    }
});

function renderApp(phases) {
    phasesContainer.innerHTML = '';
    badgesContainer.innerHTML = '';
    
    let totalTasks = 0;
    let completedTasksGlobal = 0;

    // 1. PRE-PROCESAMIENTO: Calcular estados antes de ordenar
    phases.forEach(phase => {
        if (!phase.tasks) phase.tasks = []; // Protección si no hay tareas
        const completedCount = phase.tasks.filter(t => t.done).length;
        // Agregamos una propiedad temporal 'isCompleted'
        phase.isCompleted = (completedCount === phase.tasks.length && phase.tasks.length > 0);
        
        // Sumamos al global
        totalTasks += phase.tasks.length;
        completedTasksGlobal += completedCount;
    });

    // 2. ORDENAMIENTO MAGICO: Activos arriba, Completados abajo
    phases.sort((a, b) => {
        // Si ambos tienen el mismo estado (ambos incompletos o ambos completos),
        // ordénalos por su ID original (Nivel 1, luego Nivel 2...)
        if (a.isCompleted === b.isCompleted) {
            return a.id - b.id;
        }
        // Si no, pon los completados (true) al final
        return a.isCompleted ? 1 : -1;
    });

    // 3. RENDERIZADO (DIBUJAR EN PANTALLA)
    phases.forEach((phase) => {
        // Recalculamos porcentaje para dibujar la barra
        const phaseCompletedTasks = phase.tasks.filter(t => t.done).length;
        const phaseTotalTasks = phase.tasks.length;
        const phasePercent = phaseTotalTasks === 0 ? 0 : Math.round((phaseCompletedTasks / phaseTotalTasks) * 100);

        // Crear la tarjeta HTML
        const card = document.createElement('div');
        card.classList.add('phase-card');
        
        // Si está completa, añadimos clase y sello
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

            <div class="tasks-list">
                </div>
        `;

        const taskListContainer = card.querySelector('.tasks-list');
        
        // Dibujar las tareas dentro de la tarjeta
        phase.tasks.forEach((task) => {
            const taskItem = document.createElement('div');
            taskItem.classList.add('task-item');
            
            // Usamos phase.id para saber cuál actualizar en la BD, 
            // no el índice del array ordenado
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

        // Crear el Trofeo (Badge)
        // Nota: Los trofeos SÍ los queremos en orden original (1, 2, 3, 4, 5)
        // Así que no los dibujamos aquí, los guardamos y dibujamos al final o usamos lógica diferente.
        // TRUCO: Como ya ordenamos 'phases', los badges saldrían desordenados.
        // Vamos a dibujar los badges APARTE basándonos en el ID.
    });

    // 4. RENDERIZADO DE BADGES (En orden correcto 1-5)
    // Reordenamos temporalmente por ID solo para los badges
    const sortedBadges = [...phases].sort((a, b) => a.id - b.id);
    
    sortedBadges.forEach(phase => {
        const badge = document.createElement('div');
        badge.classList.add('badge');
        if (phase.isCompleted) badge.classList.add('unlocked');
        badge.innerText = phase.badge;
        badgesContainer.appendChild(badge);
    });

    // 5. Actualizar Barra Global
    const globalPercent = totalTasks === 0 ? 0 : Math.round((completedTasksGlobal / totalTasks) * 100);
    globalProgressBar.style.width = `${globalPercent}%`;
    globalPercentText.innerText = `${globalPercent}%`;
}

window.toggleTask = function(phaseId, taskId, currentStatus) {
    const updates = {};
    updates[`phases/${phaseId}/tasks/${taskId}/done`] = !currentStatus;
    update(ref(db), updates);
};

