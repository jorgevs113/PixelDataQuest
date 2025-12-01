// =======================================================
// 1. CONFIGURACIÓN E INICIALIZACIÓN DE FIREBASE
// =======================================================

const firebaseConfig = {
  apiKey: "AIzaSyAsc6sCTXDevRtwd-wa9uEksHng2syt9f0",
  authDomain: "pixeldataquest-jorge.firebaseapp.com",
  projectId: "pixeldataquest-jorge",
  storageBucket: "pixeldataquest-jorge.firebasestorage.app",
  messagingSenderId: "1017478767394",
  appId: "1:1017478767394:web:b9ecb4c50484e596757b7b"
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
            meses: [
                { id: "nov2025", nombre: "Noviembre 2025 — “Mapa mental del analista”", objetivo: "Conocer el rol y crear entorno.", deadline: "2025-11-30T23:59:59", 
                    tareas: [
                        { id: "nov25-t1", descripcion: "Leer 3 descripciones de puestos...", completada: false },
                        { id: "nov25-t2", descripcion: "Ver la introducción del Certificado de Google...", completada: false },
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
            meses: [
                { id: "sep2026", nombre: "Septiembre 2026 — “Power BI: Preparación PL-300”", objetivo: "Dominar Modelado, Preparación de Datos y DAX.", deadline: "2026-09-30T23:59:59", tareas: [{ id: "sep26-t1", descripcion: "Instalar Power BI Desktop y conectar con Excel/SQL.", completada: false }, { id: "sep26-t2", descripcion: "Estudiar para PL-300: Preparación y Modelado de datos.", completada: false }, { id: "sep26-t3", descripcion: "Crear un modelo de datos robusto (relaciones y diseño).", completada: false }, { id: "sep26-t4", descripcion: "Implementar las primeras funciones DAX.", completada: false }], resultado: "Primer dashboard profesional." },
                { id: "oct2026", nombre: "Octubre 2026 — “Proyecto completo de dashboard”", objetivo: "Unir Diseño, Análisis y Narrativa.", deadline: "2026-10-31T23:59:59", tareas: [{ id: "oct26-t1", descripcion: "Estudiar para PL-300: Visualizar y Desplegar.", completada: false }, { id: "oct26-t2", descripcion: "Integrar múltiples fuentes (Excel + CSV + SQL).", completada: false }, { id: "oct26-t3", descripcion: "Crear KPIs y filtros avanzados.", completada: false }, { id: "oct26-t4", descripcion: "Exportar y publicar el dashboard.", completada: false }], resultado: "Tienes un proyecto digno de entrevista." }
            ]
        },
        
        // FASE 5: Portafolio e Ingresos (Noviembre - Diciembre 2026)
        {
            id: "fase5", nombre: "🟥 FASE 5 — Portafolio e ingresos", color: "#FF0000",
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

// Guarda el estado actual del plan en Firebase
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

// Carga el estado del plan desde Firebase
function loadProgressFromFirebase() {
    return new Promise((resolve, reject) => {
        database.ref(PROGRESS_KEY).once('value')
            .then(snapshot => {
                const savedData = snapshot.val();
                if (savedData) {
                    console.log("Progreso cargado desde Firebase.");
                    
                    // Actualiza el plan local con los datos de Firebase
                    plan.fases.forEach(fase => {
                        fase.meses.forEach(mes => {
                            if (savedData[mes.id]) {
                                mes.tareas = mes.tareas.map(localTask => {
                                    const savedTask = savedData[mes.id].find(t => t.id === localTask.id);
                                    // Mantiene la descripción de la tarea pero actualiza el estado 'completada'
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
                // Resuelve aunque haya error para que la app continúe sin sincronización
                resolve(); 
            });
    });
}


// =======================================================
// 4. FUNCIONES DE RENDERING Y LÓGICA
// =======================================================

// Encuentra el módulo activo (el mes actual o el siguiente)
function findCurrentModule() {
    const today = new Date();
    
    for (const fase of plan.fases) {
        for (const mes of fase.meses) {
            const deadline = new Date(mes.deadline);
            // Si la fecha límite aún no ha pasado, este es el mes activo
            if (today <= deadline) {
                return { fase: fase, modulo: mes };
            }
        }
    }
    // Si todo terminó, retorna el último módulo
    const lastFase = plan.fases[plan.fases.length - 1];
    return { fase: lastFase, modulo: lastFase.meses[lastFase.meses.length - 1] };
}

// ----------------------------------------------------
// A. ACTUALIZAR BARRAS DE PROGRESO
// ----------------------------------------------------
function updateProgressBars() {
    let totalTasks = 0;
    let completedTasks = 0;
    
    // 1. CÁLCULO GLOBAL
    plan.fases.forEach(fase => {
        fase.meses.forEach(mes => {
            totalTasks += mes.tareas.length;
            completedTasks += mes.tareas.filter(t => t.completada).length;
        });
    });

    const yearlyPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    // 2. CÁLCULO MENSUAL (para el módulo activo)
    const currentModuleTotal = currentModule ? currentModule.tareas.length : 0;
    const currentModuleCompleted = currentModule ? currentModule.tareas.filter(t => t.completada).length : 0;
    const monthlyPercentage = currentModuleTotal > 0 ? (currentModuleCompleted / currentModuleTotal) * 100 : 0;


    // ACTUALIZAR HTML
    document.getElementById('yearly-bar-fill').style.width = `${yearlyPercentage}%`;
    document.getElementById('yearly-percentage').textContent = `${Math.round(yearlyPercentage)}%`;
    
    document.getElementById('monthly-bar-fill').style.width = `${monthlyPercentage}%`;
    document.getElementById('monthly-percentage').textContent = `${Math.round(monthlyPercentage)}%`;
}

// ----------------------------------------------------
// B. CONTADOR CIRCULAR
// ----------------------------------------------------
function startCountdown(deadlineStr) {
    const deadline = new Date(deadlineStr);

    function updateCounter() {
        const now = new Date();
        const diff = deadline - now;

        const progressCircle = document.querySelector('.progress-circle');
        const totalDuration = new Date(currentModule.deadline) - new Date(currentModule.deadline.split('-').slice(0, 2).join('-') + '-01'); // Duración del mes

        if (diff <= 0) {
            document.getElementById('days-left').textContent = 'QUEST';
            document.getElementById('hms-left').textContent = 'COMPLETED';
            progressCircle.style.strokeDashoffset = 0;
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days-left').textContent = `${days} DAYS`;
        document.getElementById('hms-left').textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        // CÁLCULO DEL CÍRCULO: Tiempo restante vs. tiempo total del módulo
        const remainingPercentage = (diff / totalDuration) * 100;
        const offset = CIRCUMFERENCE - (remainingPercentage / 100) * CIRCUMFERENCE;
        
        progressCircle.style.strokeDashoffset = offset;
    }

    updateCounter();
    setInterval(updateCounter, 1000);
}

// ----------------------------------------------------
// C. RENDERIZAR INTERFAZ Y MANEJO DE CLICKS
// ----------------------------------------------------

function renderCurrentModule(fase, modulo) {
    // Títulos y Objetivos
    document.getElementById('current-phase-title').textContent = fase.nombre;
    document.getElementById('current-module-title').textContent = modulo.nombre;
    document.getElementById('current-module-objective').textContent = modulo.objetivo;
    document.getElementById('outcome-text').textContent = modulo.resultado;

    const tasksList = document.getElementById('current-tasks');
    tasksList.innerHTML = ''; 

    // Inyectar las tareas con sus checkboxes
    modulo.tareas.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="task-checkbox" data-task-id="${task.id}"></div>
            <span>${task.descripcion}</span>
        `;
        if (task.completada) {
            li.classList.add('completed');
        }
        
        // Asigna el evento de click
        li.querySelector('.task-checkbox').addEventListener('click', handleTaskClick); 
        tasksList.appendChild(li);
    });

    startCountdown(modulo.deadline);
    updateProgressBars();
}

function renderSidebar() {
    const phasesList = document.getElementById('phases-list');
    phasesList.innerHTML = '';

    plan.fases.forEach(fase => {
        const li = document.createElement('li');
        li.innerHTML = `<span style="color: ${fase.color}">■</span> ${fase.nombre.split('—')[0].trim()}`;
        phasesList.appendChild(li);
    });
}

function handleTaskClick(event) {
    const taskId = event.currentTarget.getAttribute('data-task-id');
    const listItem = event.currentTarget.parentNode;
    const isCompleted = listItem.classList.toggle('completed');

    // 1. Actualizar el estado en la data local
    currentModule.tareas = currentModule.tareas.map(t => {
        if (t.id === taskId) {
            t.completada = isCompleted;
        }
        return t;
    });

    // 2. Recalcular las barras de progreso
    updateProgressBars();
    
    // 3. ¡GUARDA EL PROGRESO EN FIREBASE!
    saveProgressToFirebase(); 
}


// =======================================================
// 5. INICIO DE LA APLICACIÓN (ESPERA A LA CARGA DE FIREBASE)
// =======================================================

window.onload = function() {
    // 1. CARGA LA DATA DE FIREBASE Y ESPERA
    loadProgressFromFirebase().then(() => {
        const { fase, modulo } = findCurrentModule();
        currentModule = modulo;
        
        // 2. RENDERIZA EL CONTENIDO
        renderCurrentModule(fase, modulo);
        renderSidebar();
        
        // 3. Ajusta el estilo SVG
        const progressCircle = document.querySelector('.progress-circle');
        if (progressCircle) {
            // Inicializa la propiedad para que el contador funcione correctamente
            progressCircle.style.strokeDasharray = `${CIRCUMFERENCE} ${CIRCUMFERENCE}`;
        }
    });
};