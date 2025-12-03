// =======================================================
// 1. CONFIGURACIÓN E INICIALIZACIÓN DE FIREBASE
// =======================================================

const firebaseConfig = {
  // CREDENCIALES COMPLETAS PARA TU PROYECTO PIXEL DATA QUEST
  apiKey: "AIzaSyAsc6sCTXDevRtwd-wa9uEksHng2syt9f0",
  authDomain: "pixeldataquest-jorge.firebaseapp.com",
  projectId: "pixeldataquest-jorge",
  storageBucket: "pixeldataquest-jorge.firebasestorage.app",
  messagingSenderId: "1017478767394",
  appId: "1:1017478767394:web:b9ecb4c50484e596757b7b",
  // CLAVE CRUCIAL: URL de la Realtime Database
  databaseURL: "https://pixeldataquest-jorge-default-rtdb.firebaseio.com" 
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

// Referencia a la base de datos
const database = firebase.database(); 
const PROGRESS_KEY = 'jorge-pixel-data-quest-progress'; 

// Variables globales
let currentModule = null; 
const CIRCUMFERENCE = 2 * Math.PI * 45; // Para el contador circular

// =======================================================
// 2. ESTRUCTURA DEL PLAN DE ESTUDIO (BASE DE DATOS LOCAL)
// =======================================================

const plan = {
    meta: "Ser Analista de Datos funcional y rentable para diciembre de 2026",
    fases: [
        // FASE 1: Descubrimiento (Nov-Dic 2025)
        {
            id: "fase1", nombre: "🟩 FASE 1 — Descubrimiento", color: "#00FF00", 
            objetivo_fase: "Conocer el rol del analista y establecer el entorno técnico inicial.",
            meses: [
                { id: "nov2025", nombre: "Noviembre 2025 — “Mapa mental del analista”", objetivo: "Conocer el rol y crear entorno.", deadline: "2025-11-30T23:59:59", 
                    tareas: [
                        { id: "nov25-t1", descripcion: "Leer 3 descripciones de puestos para entender el rol...", completada: false },
                        { id: "nov25-t2", descripcion: "Ver la introducción del Certificado de Google (o similar)...", completada: false },
                        { id: "nov25-t3", descripcion: "Crear carpetas y cuentas (GitHub/Kaggle).", completada: false },
                        { id: "nov25-t4", descripcion: "Instalar: Excel, Python, VS Code o Jupyter Notebook.", completada: false },
                        { id: "nov25-t5", descripcion: "Guardar tus primeros datasets curiosos.", completada: false },
                    ], resultado: "Sabes qué hace un analista y tienes tu ecosistema listo."
                },
                { id: "dic2025", nombre: "Diciembre 2025 — “Preparación técnica base”", objetivo: "Preparación técnica base y Estadística Fundamental.", deadline: "2025-12-31T23:59:59", 
                    tareas: [
                        { id: "dic25-t1", descripcion: "Completar Módulo 1 y 2 del Certificado de Google.", completada: false },
                        { id: "dic25-t2", descripcion: "Practicar fórmulas simples en Excel (SUMA, PROMEDIO, CONTAR.SI).", completada: false },
                        { id: "dic25-t3", descripcion: "Entender tipos de datos (numérico, texto, fecha, booleano).", completada: false },
                        { id: "dic25-t4", descripcion: "Estadística Descriptiva Básica (media, mediana, desviación).", completada: false },
                        { id: "dic25-t5", descripcion: "Crear un documento con tus metas 2026.", completada: false },
                    ], resultado: "Entiendes los conceptos básicos y te preparas mentalmente para el trabajo real."
                },
            ]
        },
        
        // FASE 2: Fundamentos Técnicos (Enero - Abril 2026)
        {
            id: "fase2", nombre: "🟦 FASE 2 — Fundamentos técnicos", color: "#00FFFF", 
            objetivo_fase: "Dominar Excel y SQL para la extracción y manipulación eficiente de datos.",
            meses: [
                { id: "ene2026", nombre: "Enero 2026 — “Excel en serio”", objetivo: "Dominio de Excel y Módulo 3 de Google Cert.", deadline: "2026-01-31T23:59:59", tareas: [{ id: "ene26-t1", descripcion: "Aprender funciones intermedias (SI, BUSCARX, etc.).", completada: false }, { id: "ene26-t2", descripcion: "Crear tablas dinámicas y formatos condicionales.", completada: false }, { id: "ene26-t3", descripcion: "Realizar un mini informe de ventas usando funciones.", completada: false }], resultado: "Usas Excel como herramienta de análisis." },
                { id: "feb2026", nombre: "Febrero 2026 — “Excel avanzado y visualización”", objetivo: "Visualización, Git y Ética.", deadline: "2026-02-28T23:59:59", tareas: [{ id: "feb26-t1", descripcion: "Practicar gráficos y crear un dashboard sencillo en Excel.", completada: false }, { id: "feb26-t2", descripcion: "Aprender comandos básicos de Git (commit, push, pull).", completada: false }, { id: "feb26-t3", descripcion: "Leer sobre la ética y sesgos en la presentación de datos.", completada: false }], resultado: "Puedes mostrar resultados visuales profesionales." },
                { id: "mar2026", nombre: "Marzo 2026 — “Aprender SQL”", objetivo: "SQL Básico y Módulo 4 de Google Cert.", deadline: "2026-03-31T23:59:59", tareas: [{ id: "mar26-t1", descripcion: "Completar Módulo 4 de Google Cert. (SQL).", completada: false }, { id: "mar26-t2", descripcion: "Aprender: SELECT, FROM, WHERE, ORDER BY, GROUP BY.", completada: false }, { id: "mar26-t3", descripcion: "Publicar tu primer script básico de SQL en GitHub.", completada: false }], resultado: "Puedes extraer datos de una base real." },
                { id: "abr2026", nombre: "Abril 2026 — “Consultas avanzadas”", objetivo: "Consultas Avanzadas y Modelado.", deadline: "2026-04-30T23:59:59", tareas: [{ id: "abr26-t1", descripcion: "Aprender: JOIN (INNER, LEFT, RIGHT).", completada: false }, { id: "abr26-t2", descripcion: "Practicar subconsultas y Alias.", completada: false }, { id: "abr26-t3", descripcion: "Crear tu primera tabla y relacionarla con otra.", completada: false }], resultado: "Manejas SQL con seguridad." }
            ]
        },
        
        // FASE 3: Python (Mayo - Agosto 2026)
        {
            id: "fase3", nombre: "🟨 FASE 3 — Python y automatización", color: "#FFFF00",
            objetivo_fase: "Dominar Python (Pandas/Seaborn) para el análisis, limpieza y visualización avanzada de datos.",
            meses: [
                { id: "may2026", nombre: "Mayo 2026 — “Primer contacto con Python”", objetivo: "Comprender la lógica de programación.", deadline: "2026-05-31T23:59:59", tareas: [{ id: "may26-t1", descripcion: "Instalar Anaconda/Jupyter Notebook.", completada: false }, { id: "may26-t2", descripcion: "Aprender: variables, listas, diccionarios, bucles.", completada: false }, { id: "may26-t3", descripcion: "Escribir un script que calcule promedios y cuente valores.", completada: false }], resultado: "Entiendes cómo piensa un lenguaje de programación." },
                { id: "jun2026", nombre: "Junio 2026 — “Pandas y análisis básico”", objetivo: "Manipular datasets reales y Web Scraping.", deadline: "2026-06-30T23:59:59", tareas: [{ id: "jun26-t1", descripcion: "Importar y limpiar datos con Pandas (dropna, fillna).", completada: false }, { id: "jun26-t2", descripcion: "Calcular promedios, medianas y correlaciones.", completada: false }, { id: "jun26-t3", descripcion: "Web Scraping Básico: Escribir un script simple para extraer 5 datos de una web.", completada: false }], resultado: "Sabes analizar datasets con código." },
                { id: "jul2026", nombre: "Julio 2026 — “Visualización profesional con Python”", objetivo: "Visualización con Seaborn y Narrativa.", deadline: "2026-07-31T23:59:59", tareas: [{ id: "jul26-t1", descripcion: "Aprender Seaborn (boxplot, heatmap).", completada: false }, { id: "jul26-t2", descripcion: "Crear 4 visualizaciones distintas de un dataset propio.", completada: false }, { id: "jul26-t3", descripcion: "Combinar texto + gráficos en un notebook con conclusiones.", completada: false }, { id: "jul26-t4", descripcion: "Publicar el notebook en GitHub.", completada: false }], resultado: "Sabes contar una historia con datos visuales." },
                { id: "ago2026", nombre: "Agosto 2026 — “Proyecto intermedio Python”", objetivo: "Proyecto Integrador y Finalizar Google Cert.", deadline: "2026-08-31T23:59:59", tareas: [{ id: "ago26-t1", descripcion: "Escoger un dataset grande, limpiar, analizar y graficar.", completada: false }, { id: "ago26-t2", descripcion: "Escribir conclusiones y patrones detectados.", completada: false }, { id: "ago26-t3", descripcion: "Subir el proyecto a GitHub con README explicativo.", completada: false }, { id: "ago26-t4", descripcion: "Finalizar y obtener el Certificado de Google.", completada: false }], resultado: "Primer proyecto con potencial profesional." }
            ]
        },
        
        // FASE 4: Visualización profesional (Septiembre - Octubre 2026)
        {
            id: "fase4", nombre: "🟧 FASE 4 — Visualización profesional", color: "#FFA500",
            objetivo_fase: "Dominar Power BI (PL-300) para crear dashboards interactivos y profesionales.",
            meses: [
                { id: "sep2026", nombre: "Septiembre 2026 — “Power BI: Preparación PL-300”", objetivo: "Dominar Modelado, Preparación de Datos y DAX.", deadline: "2026-09-30T23:59:59", tareas: [{ id: "sep26-t1", descripcion: "Instalar Power BI Desktop y conectar con Excel/SQL.", completada: false }, { id: "sep26-t2", descripcion: "Estudiar para PL-300: Preparación y Modelado de datos.", completada: false }, { id: "sep26-t3", descripcion: "Crear un modelo de datos robusto (relaciones y diseño).", completada: false }, { id: "sep26-t4", descripcion: "Implementar las primeras funciones DAX.", completada: false }], resultado: "Primer dashboard profesional." },
                { id: "oct2026", nombre: "Octubre 2026 — “Proyecto completo de dashboard”", objetivo: "Unir Diseño, Análisis y Narrativa.", deadline: "2026-10-31T23:59:59", tareas: [{ id: "oct26-t1", descripcion: "Estudiar para PL-300: Visualizar y Desplegar.", completada: false }, { id: "oct26-t2", descripcion: "Integrar múltiples fuentes (Excel + CSV + SQL).", completada: false }, { id: "oct26-t3", descripcion: "Crear KPIs y filtros avanzados.", completada: false }, { id: "oct26-t4", descripcion: "Exportar y publicar el dashboard.", completada: false }], resultado: "Tienes un proyecto digno de entrevista." }
            ]
        },
        
        // FASE 5: Portafolio e Ingresos (Noviembre - Diciembre 2026)
        {
            id: "fase5", nombre: "🟥 FASE 5 — Portafolio e ingresos", color: "#FF0000",
            objetivo_fase: "Monetizar conocimientos, obtener certificaciones y aplicar a puestos de Analista Junior.",
            meses: [
                { id: "nov2026", nombre: "Noviembre 2026 — “Portafolio y visibilidad”", objetivo: "Mostrar tu trabajo de forma profesional.", deadline: "2026-11-30T23:59:59", tareas: [{ id: "nov26-t1", descripcion: "Objetivo: Obtener la Certificación PL-300 de Microsoft.", completada: false }, { id: "nov26-t2", descripcion: "Organizar tus 3 proyectos finales (Excel, Python, Power BI) en GitHub.", completada: false }, { id: "nov26-t3", descripcion: "Diseñar un portafolio simple (GitHub Pages o Notion).", completada: false }, { id: "nov26-t4", descripcion: "Actualizar tu LinkedIn con la palabra clave 'Data Analyst'.", completada: false }], resultado: "Presencia profesional sólida." },
                { id: "dic2026", nombre: "Diciembre 2026 — “Puerta a ingresos”", objetivo: "Empezar a generar dinero.", deadline: "2026-12-31T23:59:59", tareas: [{ id: "dic26-t1", descripcion: "Buscar proyectos freelance pequeños (Workana, Upwork).", completada: false }, { id: "dic26-t2", descripcion: "Practicar entrevistas simuladas (preguntas comunes de analista).", completada: false }, { id: "dic26-t3", descripcion: "Escribir tus próximos pasos para 2027.", completada: false }, { id: "dic26-t4", descripcion: "Celebrar tu avance (sí, cuenta como paso técnico).", completada: false }], resultado: "Comienzas a monetizar o estás listo para aplicar a puestos junior." }
            ]
        },
    ]
};

// =======================================================
// 3. FUNCIONES DE MANEJO DE DATOS (FIREBASE)
// =======================================================

function saveProgressToFirebase() {
    const progressToSave = {};
    plan.fases.forEach(fase => {
        fase.meses.forEach(mes => {
            progressToSave[mes.id] = mes.tareas.map(t => ({
                id: t.id,
                completada: t.completada
            }));
        });
    });

    database.ref(PROGRESS_KEY).set(progressToSave)
        .then(() => {
            console.log("Progreso guardado en Pixel Data Quest (Firebase).");
        })
        .catch(error => {
            console.error("Error al guardar el progreso:", error);
        });
}

function loadProgressFromFirebase() {
    return new Promise((resolve, reject) => {
        database.ref(PROGRESS_KEY).once('value')
            .then(snapshot => {
                const savedData = snapshot.val();
                if (savedData) {
                    console.log("Progreso cargado desde Firebase.");
                    
                    plan.fases.forEach(fase => {
                        fase.meses.forEach(mes => {
                            if (savedData[mes.id]) {
                                mes.tareas = mes.tareas.map(localTask => {
                                    const savedTask = savedData[mes.id].find(t => t.id === localTask.id);
                                    return savedTask ? { ...localTask, completada: savedTask.completada } : localTask;
                                });
                            }
                        });
                    });
                } else {
                    console.log("No se encontró progreso guardado. Usando plan inicial.");
                }
                resolve();
            })
            .catch(error => {
                console.error("Error al cargar el progreso:", error);
                resolve(); 
            });
    });
}


// =======================================================
// 4. FUNCIONES DE RENDERING Y LÓGICA
// =======================================================

// LÓGICA DE BLOQUEO: Foco en el primer mes con tareas pendientes
function findCurrentModule() {
    for (const fase of plan.fases) {
        for (const mes of fase.meses) {
            const tareasPendientes = mes.tareas.filter(t => !t.completada).length;
            
            if (tareasPendientes > 0) {
                return { fase: fase, modulo: mes };
            }
        }
    }
    
    const lastFase = plan.fases[plan.fases.length - 1];
    return { fase: lastFase, modulo: lastFase.meses[lastFase.meses.length - 1] };
}

function updateProgressBars() {
    let totalTasks = 0;
    let completedTasks = 0;
    
    plan.fases.forEach(fase => {
        fase.meses.forEach(mes => {
            totalTasks += mes.tareas.length;
            completedTasks += mes.tareas.filter(t => t.completada).length;
        });
    });

    const yearlyPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    const currentModuleTotal = currentModule ? currentModule.tareas.length : 0;
    const currentModuleCompleted = currentModule ? currentModule.tareas.filter(t => t.completada).length : 0;
    const monthlyPercentage = currentModuleTotal > 0 ? (currentModuleCompleted / currentModuleTotal) * 100 : 0;


    document.getElementById('yearly-bar-fill').style.width = `${yearlyPercentage}%`;
    document.getElementById('yearly-percentage').textContent = `${Math.round(yearlyPercentage)}%`;
    
    document.getElementById('monthly-bar-fill').style.width = `${monthlyPercentage}%`;
    document.getElementById('monthly-percentage').textContent = `${Math.round(monthlyPercentage)}%`;
    
    renderSidebar();
}

function startCountdown(deadlineStr) {
    const deadline = new Date(deadlineStr);

    function updateCounter() {
        const now = new Date();
        const diff = deadline - now;

        const progressCircle = document.querySelector('.progress-circle');
        const totalDuration = new Date(currentModule.deadline) - new Date(currentModule.deadline.split('-').slice(0, 2).join('-') + '-01');

        if (diff <= 0) {
            document.getElementById('days-left').textContent = 'QUEST';
            document.getElementById('hms-left').textContent = 'COMPLETADA';
            progressCircle.style.strokeDashoffset = 0;
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days-left').textContent = `${days} DÍAS`;
        document.getElementById('hms-left').textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        const remainingPercentage = (diff / totalDuration) * 100;
        const offset = CIRCUMFERENCE - (remainingPercentage / 100) * CIRCUMFERENCE;
        
        progressCircle.style.strokeDashoffset = offset;
    }

    updateCounter();
    setInterval(updateCounter, 1000);
}

function renderCurrentModule(fase, modulo) {
    document.getElementById('current-phase-title').textContent = fase.nombre.split('—')[0].trim();
    document.getElementById('current-module-title').textContent = modulo.nombre;
    document.getElementById('current-module-objective').textContent = modulo.objetivo;
    document.getElementById('outcome-text').textContent = modulo.resultado;

    const tasksList = document.getElementById('current-tasks');
    tasksList.innerHTML = ''; 

    modulo.tareas.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="task-checkbox" data-task-id="${task.id}"></div>
            <span>${task.descripcion}</span>
        `;
        if (task.completada) {
            li.classList.add('completed');
        }
        
        li.querySelector('.task-checkbox').addEventListener('click', handleTaskClick); 
        tasksList.appendChild(li);
    });

    startCountdown(modulo.deadline);
    updateProgressBars();
}

// LÓGICA DE RADAR: Renderizado del Sidebar con Fases y Colores
function renderSidebar() {
    const phasesList = document.getElementById('phases-list');
    phasesList.innerHTML = '';
    const colorOff = getComputedStyle(document.documentElement).getPropertyValue('--color-off').trim();

    plan.fases.forEach(fase => {
        // 1. CÁLCULO de progreso de la FASE
        let faseTotalTasks = 0;
        let faseCompletedTasks = 0;
        fase.meses.forEach(mes => {
            faseTotalTasks += mes.tareas.length;
            faseCompletedTasks += mes.tareas.filter(t => t.completada).length;
        });
        const fasePercentage = faseTotalTasks > 0 ? (faseCompletedTasks / faseTotalTasks) * 100 : 0;
        const isFaseCompleted = fasePercentage === 100;
        
        const faseColor = isFaseCompleted ? fase.color : colorOff;
        const faseTitleClass = isFaseCompleted ? 'completed-phase' : '';

        // 2. TÍTULO DE FASE con Objetivo
        const faseLi = document.createElement('li');
        faseLi.innerHTML = `
            <span class="phase-title-line ${faseTitleClass}" style="color: ${faseColor};">
                ■ ${fase.nombre.split('—')[0].trim()} (${Math.round(fasePercentage)}%)
            </span>
            <span class="phase-objective-line">
                OBJETIVO: ${fase.objetivo_fase || 'N/A'}
            </span>
            <div class="bar-bg" style="width: 90%; margin: 3px 0;">
                <div class="bar-fill" style="width: ${fasePercentage}%; background-color: ${fase.color}; height: 8px;"></div>
            </div>
            <ul style="padding-left: 5px; margin-top: 5px; list-style: none;">
        `;
        phasesList.appendChild(faseLi);
        
        // 3. LISTADO DE MESES DENTRO DE LA FASE
        fase.meses.forEach(mes => {
            const mesTotalTasks = mes.tareas.length;
            const mesCompletedTasks = mes.tareas.filter(t => t.completada).length;
            const mesPercentage = mesTotalTasks > 0 ? (mesCompletedTasks / mesTotalTasks) * 100 : 0;
            
            const mesLi = document.createElement('li');
            mesLi.style.fontFamily = 'monospace';
            mesLi.style.fontSize = '0.75rem';
            mesLi.innerHTML = `
                ${mes.nombre.split('—')[0].trim()} (${Math.round(mesPercentage)}%)
                <div class="bar-bg" style="width: 80%; margin: 2px 0;"><div class="bar-fill" style="width: ${mesPercentage}%; background-color: var(--neon-blue); height: 6px;"></div></div>
            `;
            phasesList.appendChild(mesLi);
        });
        phasesList.appendChild(document.createElement('br'));
    });
}

function handleTaskClick(event) {
    const taskId = event.currentTarget.getAttribute('data-task-id');
    const listItem = event.currentTarget.parentNode;
    const isCompleted = listItem.classList.toggle('completed');

    currentModule.tareas = currentModule.tareas.map(t => {
        if (t.id === taskId) {
            t.completada = isCompleted;
        }
        return t;
    });

    updateProgressBars();
    saveProgressToFirebase(); 
    
    // Chequea si el módulo se completó para forzar un cambio de foco
    if (currentModule.tareas.every(t => t.completada)) {
        // Recarga para ir al siguiente mes bloqueado
        loadProgressFromFirebase().then(() => {
            const { fase, modulo } = findCurrentModule();
            currentModule = modulo;
            renderCurrentModule(fase, modulo);
        });
    }
}


// =======================================================
// 5. INICIO DE LA APLICACIÓN
// =======================================================

window.onload = function() {
    loadProgressFromFirebase().then(() => {
        const { fase, modulo } = findCurrentModule();
        currentModule = modulo;
        
        renderCurrentModule(fase, modulo);
        
        const progressCircle = document.querySelector('.progress-circle');
        if (progressCircle) {
            progressCircle.style.strokeDasharray = `${CIRCUMFERENCE} ${CIRCUMFERENCE}`;
        }
    });
};
