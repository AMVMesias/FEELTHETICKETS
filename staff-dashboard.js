// Dashboard Staff - Feel the Control
document.addEventListener('DOMContentLoaded', function() {
    initializeStaffDashboard();
    setupStaffEventListeners();
    startStaffRealTimeUpdates();
});

// Inicialización del dashboard staff
function initializeStaffDashboard() {
    console.log('=== INICIANDO DASHBOARD STAFF ===');
    
    // Verificar autenticación
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log('Usuario encontrado:', currentUser);
    
    if (!currentUser) {
        console.log('No hay usuario logueado, redirigiendo al login...');
        alert('No hay sesión activa. Serás redirigido al login.');
        window.location.href = 'index.html';
        return;
    }
    
    if (currentUser.role !== 'staff') {
        console.log('Usuario no es staff, redirigiendo...');
        alert('Acceso denegado. Este dashboard es solo para staff.');
        window.location.href = 'index.html';
        return;
    }
    
    // Actualizar nombre del usuario en la interfaz
    const userNameElement = document.getElementById('userName');
    if (userNameElement && currentUser.name) {
        userNameElement.textContent = currentUser.name;
    }
    
    console.log('Dashboard staff inicializado correctamente para:', currentUser.name);
    
    // Actualizar fecha y hora
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Cargar datos del staff
    loadStaffDashboardData();
    
    // Configurar navegación
    setupStaffNavigation();
    
    // Inicializar gráfico circular de presupuesto
    initializeBudgetChart();
}

// Configurar event listeners específicos del staff
function setupStaffEventListeners() {
    // Toggle sidebar en móvil
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    // Navegación del sidebar
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', handleStaffNavigation);
    });
    
    // Botón de marcar notificaciones como leídas
    const markReadBtn = document.querySelector('.mark-read-btn');
    if (markReadBtn) {
        markReadBtn.addEventListener('click', markNotificationsRead);
    }
    
    // Notificaciones
    const notificationBtn = document.querySelector('.notification-btn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', showStaffNotifications);
    }
}

// Configurar navegación específica del staff
function setupStaffNavigation() {
    const sections = ['dashboard', 'mis-gastos', 'solicitudes', 'eventos-asignados', 'carga-asistencia', 'mi-perfil'];
    
    // Mostrar solo dashboard inicialmente
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            element.style.display = section === 'dashboard' ? 'block' : 'none';
        }
    });
    
    // Inicializar sistema de carga de archivos (incluye sidebar)
    initializeFileUpload();
}

function handleStaffNavigation(e) {
    e.preventDefault();
    
    // Remover clase active de todos los nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Agregar clase active al item clickeado
    e.target.closest('.nav-item').classList.add('active');
    
    // Obtener la sección del href
    const href = e.target.getAttribute('href');
    const section = href ? href.substring(1) : 'dashboard';
    
    // Mostrar contenido correspondiente
    showStaffSection(section);
}

function showStaffSection(sectionName) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('[id^="dashboard"], [id^="mis-gastos"], [id^="solicitudes"], [id^="eventos-asignados"], [id^="carga-asistencia"], [id^="mi-perfil"]');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Mostrar la sección seleccionada
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.style.display = 'block';
        
        // Si es la sección de carga de asistencia, asegurar que esté inicializada
        if (sectionName === 'carga-asistencia') {
            initializeFileUpload();
        }
    } else {
        // Si no existe la sección, mostrar dashboard
        document.getElementById('dashboard').style.display = 'block';
        showModal('info', 'Sección en Desarrollo', 'Esta funcionalidad estará disponible próximamente.');
    }
}

// Cargar datos específicos del staff
function loadStaffDashboardData() {
    animateStaffNumbers();
    loadMyRecentExpenses();
    loadAssignedEvents();
    loadStaffNotifications();
    updateBudgetTracking();
}

// Animar números en las estadísticas del staff
function animateStaffNumbers() {
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(element => {
        const finalValue = element.textContent;
        if (finalValue.includes('$')) {
            animateNumber(element, finalValue);
        } else if (finalValue.includes('%')) {
            animatePercentage(element, finalValue);
        }
    });
}

function animatePercentage(element, finalValue) {
    const numericValue = parseFloat(finalValue.replace('%', ''));
    const duration = 2000;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
            current = numericValue;
            clearInterval(timer);
        }
        
        element.textContent = current.toFixed(1) + '%';
    }, duration / steps);
}

// Cargar mis gastos recientes
function loadMyRecentExpenses() {
    const myExpenses = [
        {
            id: 1,
            icon: 'fas fa-utensils',
            title: 'Almuerzo Equipo',
            description: 'Evento: Concierto Rock 2025',
            date: 'Hace 2 días',
            amount: 45.00,
            status: 'approved'
        },
        {
            id: 2,
            icon: 'fas fa-gas-pump',
            title: 'Combustible',
            description: 'Transporte material',
            date: 'Hace 1 día',
            amount: 65.00,
            status: 'pending'
        },
        {
            id: 3,
            icon: 'fas fa-shopping-cart',
            title: 'Materiales Oficina',
            description: 'Suministros básicos',
            date: 'Hace 3 días',
            amount: 28.50,
            status: 'approved'
        },
        {
            id: 4,
            icon: 'fas fa-coffee',
            title: 'Café Reunión',
            description: 'Reunión con clientes',
            date: 'Hace 4 días',
            amount: 15.00,
            status: 'rejected'
        }
    ];
    
    updateMyExpensesWidget(myExpenses);
}

function updateMyExpensesWidget(expenses) {
    const container = document.querySelector('.my-recent-expenses .expenses-list');
    if (!container) return;
    
    container.innerHTML = expenses.map(expense => `
        <div class="expense-item ${expense.status}">
            <div class="expense-icon">
                <i class="${expense.icon}"></i>
            </div>
            <div class="expense-details">
                <h4>${expense.title}</h4>
                <p>${expense.description}</p>
                <span class="expense-date">${expense.date}</span>
            </div>
            <div class="expense-amount">
                <span>$${expense.amount.toFixed(2)}</span>
                <span class="status ${expense.status}">${getStatusText(expense.status)}</span>
            </div>
        </div>
    `).join('');
}

function getStatusText(status) {
    const statusTexts = {
        approved: 'Aprobado',
        pending: 'Pendiente',
        rejected: 'Rechazado'
    };
    return statusTexts[status] || status;
}

// Cargar eventos asignados
function loadAssignedEvents() {
    const assignedEvents = [
        {
            id: 1,
            name: 'Concierto Rock 2025',
            location: 'Estadio Olímpico',
            date: '27',
            month: 'JUL',
            time: '19:00 - 23:00',
            priority: 'urgent'
        },
        {
            id: 2,
            name: 'Festival de Jazz',
            location: 'Centro Cultural',
            date: '30',
            month: 'JUL',
            time: '20:00 - 24:00',
            priority: 'normal'
        },
        {
            id: 3,
            name: 'Evento Corporativo',
            location: 'Hotel Marriott',
            date: '02',
            month: 'AGO',
            time: '18:00 - 22:00',
            priority: 'low'
        }
    ];
    
    updateAssignedEventsWidget(assignedEvents);
}

function updateAssignedEventsWidget(events) {
    const container = document.querySelector('.assigned-events-widget .events-list');
    if (!container) return;
    
    container.innerHTML = events.map(event => `
        <div class="event-item ${event.priority}">
            <div class="event-date">
                <span class="day">${event.date}</span>
                <span class="month">${event.month}</span>
            </div>
            <div class="event-details">
                <h4>${event.name}</h4>
                <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                <p><i class="fas fa-clock"></i> ${event.time}</p>
            </div>
            <div class="event-status">
                <span class="priority ${event.priority}">${getPriorityText(event.priority)}</span>
            </div>
        </div>
    `).join('');
}

function getPriorityText(priority) {
    const priorityTexts = {
        urgent: 'Urgente',
        normal: 'Normal',
        low: 'Baja'
    };
    return priorityTexts[priority] || priority;
}

// Cargar notificaciones del staff
function loadStaffNotifications() {
    const notifications = [
        {
            id: 1,
            type: 'success',
            message: 'Tu solicitud de gasto por $65.00 ha sido <strong>aprobada</strong>',
            time: 'Hace 1 hora',
            unread: true
        },
        {
            id: 2,
            type: 'warning',
            message: 'Te acercas al límite de tu presupuesto mensual (80%)',
            time: 'Hace 3 horas',
            unread: true
        },
        {
            id: 3,
            type: 'info',
            message: 'Recordatorio: Evento "Concierto Rock 2025" en 2 días',
            time: 'Hace 1 día',
            unread: false
        }
    ];
    
    updateNotificationsWidget(notifications);
}

function updateNotificationsWidget(notifications) {
    const container = document.querySelector('.notifications-widget .notifications-list');
    if (!container) return;
    
    container.innerHTML = notifications.map(notification => `
        <div class="notification-item ${notification.unread ? 'unread' : ''}">
            <div class="notification-icon ${notification.type}">
                <i class="fas fa-${getNotificationIcon(notification.type)}"></i>
            </div>
            <div class="notification-content">
                <p>${notification.message}</p>
                <span class="notification-time">${notification.time}</span>
            </div>
        </div>
    `).join('');
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check',
        warning: 'exclamation-triangle',
        info: 'calendar'
    };
    return icons[type] || 'info';
}

// Actualizar seguimiento de presupuesto
function updateBudgetTracking() {
    const budgetData = {
        used: 1247.50,
        total: 2500.00,
        categories: [
            { name: 'Transporte', used: 300, limit: 500 },
            { name: 'Alimentación', used: 225, limit: 500 },
            { name: 'Materiales', used: 150, limit: 500 }
        ]
    };
    
    updateBudgetWidget(budgetData);
}

function updateBudgetWidget(data) {
    const percentage = (data.used / data.total * 100).toFixed(1);
    
    // Actualizar porcentaje principal
    const percentageElement = document.querySelector('.percentage');
    if (percentageElement) {
        percentageElement.textContent = percentage + '%';
    }
    
    // Actualizar gráfico circular
    const circle = document.querySelector('.circle');
    if (circle) {
        const circumference = 2 * Math.PI * 15.9155;
        const offset = circumference - (percentage / 100) * circumference;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = offset;
    }
    
    // Actualizar detalles del presupuesto
    const budgetDetails = document.querySelector('.budget-details');
    if (budgetDetails) {
        budgetDetails.innerHTML = `
            <div class="budget-item">
                <span class="label">Usado:</span>
                <span class="amount">$${data.used.toFixed(2)}</span>
            </div>
            <div class="budget-item">
                <span class="label">Disponible:</span>
                <span class="amount">$${(data.total - data.used).toFixed(2)}</span>
            </div>
            <div class="budget-item total">
                <span class="label">Total Asignado:</span>
                <span class="amount">$${data.total.toFixed(2)}</span>
            </div>
        `;
    }
    
    // Actualizar categorías
    const categoriesContainer = document.querySelector('.budget-categories');
    if (categoriesContainer) {
        categoriesContainer.innerHTML = data.categories.map(category => {
            const categoryPercentage = (category.used / category.limit * 100);
            return `
                <div class="category-item">
                    <span class="category-name">${category.name}</span>
                    <div class="category-bar">
                        <div class="category-fill" style="width: ${categoryPercentage}%"></div>
                    </div>
                    <span class="category-amount">$${category.used}</span>
                </div>
            `;
        }).join('');
    }
}

// Inicializar gráfico circular
function initializeBudgetChart() {
    // Crear gradiente SVG
    const svg = document.querySelector('.circular-chart');
    if (svg) {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.id = 'gradient';
        gradient.innerHTML = `
            <stop offset="0%" style="stop-color:#27ae60;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#2ecc71;stop-opacity:1" />
        `;
        defs.appendChild(gradient);
        svg.appendChild(defs);
        
        const circle = document.querySelector('.circle');
        if (circle) {
            circle.setAttribute('stroke', 'url(#gradient)');
        }
    }
}

// Marcar notificaciones como leídas
function markNotificationsRead() {
    const unreadNotifications = document.querySelectorAll('.notification-item.unread');
    unreadNotifications.forEach(notification => {
        notification.classList.remove('unread');
    });
    
    // Actualizar badge de notificaciones
    const notificationBadge = document.querySelector('.notification-badge');
    if (notificationBadge) {
        notificationBadge.textContent = '0';
    }
    
    showModal('success', 'Notificaciones', 'Todas las notificaciones han sido marcadas como leídas.');
}

// Mostrar notificaciones del staff
function showStaffNotifications() {
    const notifications = [
        {
            type: 'success',
            message: 'Tu solicitud de gasto por $65.00 ha sido aprobada',
            time: 'Hace 1 hora'
        },
        {
            type: 'warning',
            message: 'Te acercas al límite de tu presupuesto mensual',
            time: 'Hace 3 horas'
        },
        {
            type: 'info',
            message: 'Recordatorio: Evento próximo en 2 días',
            time: 'Hace 1 día'
        }
    ];
    
    const notificationsList = notifications.map(notif => `
        <div class="notification-item">
            <div class="notification-icon ${notif.type}">
                <i class="fas fa-${getNotificationIcon(notif.type)}"></i>
            </div>
            <div class="notification-content">
                <p>${notif.message}</p>
                <span class="notification-time">${notif.time}</span>
            </div>
        </div>
    `).join('');
    
    showModal('info', 'Mis Notificaciones', notificationsList);
}

// Funciones específicas del staff para acciones rápidas
function viewMyExpenses() {
    showModal('info', 'Mis Gastos', 'Redirigiendo a la sección de gastos...');
    setTimeout(() => {
        closeModal();
        handleStaffNavigation({ preventDefault: () => {}, target: { getAttribute: () => '#mis-gastos', closest: () => ({ classList: { add: () => {} } }) } });
    }, 1000);
}

function downloadReport() {
    showModal('info', 'Descargando Reporte', 'Tu reporte personal se está generando. Lo recibirás por email en unos minutos.');
}

// Funciones para los modales específicos del staff
window.showModal = function(modalType) {
    switch(modalType) {
        case 'newExpense':
            showStaffNewExpenseModal();
            break;
        case 'newRequest':
            showNewRequestModal();
            break;
        default:
            showModal('info', 'Funcionalidad', 'Esta funcionalidad estará disponible próximamente.');
    }
};

function showStaffNewExpenseModal() {
    const form = `
        <form id="staffExpenseForm" class="modal-form">
            <div class="form-group">
                <label>Título del Gasto</label>
                <input type="text" name="title" required placeholder="Ej: Transporte evento">
            </div>
            <div class="form-group">
                <label>Monto</label>
                <input type="number" name="amount" required placeholder="0.00" step="0.01" max="500">
            </div>
            <div class="form-group">
                <label>Categoría</label>
                <select name="category" required>
                    <option value="">Seleccionar categoría</option>
                    <option value="transporte">Transporte</option>
                    <option value="alimentacion">Alimentación</option>
                    <option value="materiales">Materiales</option>
                    <option value="otros">Otros</option>
                </select>
            </div>
            <div class="form-group">
                <label>Evento Relacionado</label>
                <select name="event">
                    <option value="">Seleccionar evento (opcional)</option>
                    <option value="concierto-rock">Concierto Rock 2025</option>
                    <option value="festival-jazz">Festival de Jazz</option>
                    <option value="evento-corporativo">Evento Corporativo</option>
                </select>
            </div>
            <div class="form-group">
                <label>Descripción</label>
                <textarea name="description" required placeholder="Descripción detallada del gasto"></textarea>
            </div>
            <div class="form-group">
                <label>Comprobante (opcional)</label>
                <input type="file" name="receipt" accept="image/*,.pdf">
            </div>
        </form>
    `;
    
    showModal('info', 'Registrar Nuevo Gasto', form, () => {
        const formData = new FormData(document.getElementById('staffExpenseForm'));
        const amount = parseFloat(formData.get('amount'));
        
        if (amount > 500) {
            showModal('warning', 'Límite Excedido', 'El monto excede tu límite individual de $500. Se enviará para aprobación del jefe.');
        } else {
            showModal('success', 'Gasto Registrado', 'Tu gasto ha sido registrado exitosamente y está pendiente de aprobación.');
        }
    });
}

function showNewRequestModal() {
    const form = `
        <form id="newRequestForm" class="modal-form">
            <div class="form-group">
                <label>Tipo de Solicitud</label>
                <select name="requestType" required>
                    <option value="">Seleccionar tipo</option>
                    <option value="aumento-limite">Aumento de límite</option>
                    <option value="categoria-especial">Categoría especial</option>
                    <option value="evento-extra">Asignación evento extra</option>
                    <option value="otros">Otros</option>
                </select>
            </div>
            <div class="form-group">
                <label>Asunto</label>
                <input type="text" name="subject" required placeholder="Ej: Solicitud aumento límite mensual">
            </div>
            <div class="form-group">
                <label>Monto (si aplica)</label>
                <input type="number" name="amount" placeholder="0.00" step="0.01">
            </div>
            <div class="form-group">
                <label>Justificación</label>
                <textarea name="justification" required placeholder="Explica detalladamente el motivo de tu solicitud"></textarea>
            </div>
            <div class="form-group">
                <label>Prioridad</label>
                <select name="priority" required>
                    <option value="baja">Baja</option>
                    <option value="normal" selected>Normal</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                </select>
            </div>
        </form>
    `;
    
    showModal('info', 'Nueva Solicitud', form, () => {
        const formData = new FormData(document.getElementById('newRequestForm'));
        showModal('success', 'Solicitud Enviada', 'Tu solicitud ha sido enviada al jefe para su revisión. Recibirás una respuesta en las próximas 24-48 horas.');
    });
}

// Actualizaciones en tiempo real para staff
function startStaffRealTimeUpdates() {
    // Simular actualizaciones cada 30 segundos
    setInterval(() => {
        updateStaffStats();
    }, 30000);
}

function updateStaffStats() {
    // Simular cambios menores en estadísticas
    const myExpenses = document.querySelector('.my-expenses .stat-value');
    if (myExpenses) {
        const currentValue = parseFloat(myExpenses.textContent.replace(/[$,]/g, ''));
        // Pequeños incrementos simulando nuevos gastos
        const newValue = currentValue + (Math.random() * 20);
        myExpenses.textContent = '$' + newValue.toFixed(2);
        
        // Actualizar barra de progreso
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            const percentage = (newValue / 2500 * 100);
            progressFill.style.width = percentage + '%';
        }
    }
}

// Reutilizar funciones comunes del dashboard principal
function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    const dateTimeElement = document.getElementById('currentDateTime');
    if (dateTimeElement) {
        dateTimeElement.textContent = now.toLocaleDateString('es-ES', options);
    }
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('mobile-open');
}

function animateNumber(element, finalValue) {
    const numericValue = parseFloat(finalValue.replace(/[$,]/g, ''));
    const duration = 2000;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
            current = numericValue;
            clearInterval(timer);
        }
        
        if (finalValue.includes('$')) {
            element.textContent = '$' + current.toFixed(2);
        }
    }, duration / steps);
}

function showModal(type, title, content, onConfirm = null) {
    const modalContainer = document.getElementById('modalContainer');
    
    const iconClass = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close" onclick="closeModal()">&times;</span>
            <div class="modal-header">
                <i class="modal-icon ${type} ${iconClass[type]}"></i>
                <h2 class="modal-title">${title}</h2>
            </div>
            <div class="modal-message">${content}</div>
            <div class="modal-buttons">
                ${onConfirm ? 
                    `<button class="modal-btn secondary" onclick="closeModal()">Cancelar</button>
                     <button class="modal-btn primary" onclick="confirmAction()">Confirmar</button>` :
                    `<button class="modal-btn primary" onclick="closeModal()">Cerrar</button>`
                }
            </div>
        </div>
    `;
    
    modalContainer.appendChild(modal);
    
    // Función para confirmar acción
    if (onConfirm) {
        window.confirmAction = () => {
            onConfirm();
            closeModal();
        };
    }
    
    // Cerrar modal con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function closeModal() {
    const modalContainer = document.getElementById('modalContainer');
    modalContainer.innerHTML = '';
    
    // Limpiar event listeners
    delete window.confirmAction;
}

function logout() {
    if (confirm('¿Estás seguro de que deseas cerrar la sesión?')) {
        console.log('🚪 Cerrando sesión...');
        
        // Limpiar datos de sesión
        localStorage.removeItem('currentUser');
        localStorage.removeItem('rememberedUser');
        
        // Mostrar mensaje de despedida
        alert('👋 Sesión cerrada correctamente. Redirigiendo al login...');
        
        // Redireccionar al sistema de selección de roles
        window.location.href = 'index.html';
    }
}

// ============================================================================
// FUNCIONALIDAD DE CARGA DE ASISTENCIA
// ============================================================================

// Variables globales para la carga de archivos
let filesQueue = [];
let sidebarFilesQueue = [];
let uploadHistory = JSON.parse(localStorage.getItem('uploadHistory')) || [];

// Inicializar la funcionalidad de carga de asistencia
function initializeFileUpload() {
    console.log('📁 Inicializando sistema de carga de archivos...');
    
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    
    if (fileInput && uploadArea) {
        // Event listeners para drag & drop
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('dragleave', handleDragLeave);
        uploadArea.addEventListener('drop', handleFileDrop);
        
        // Event listener para selección de archivos
        fileInput.addEventListener('change', handleFileSelect);
    }
    
    // Inicializar sidebar upload
    initializeSidebarUpload();
    
    // Cargar historial de archivos
    loadUploadHistory();
    
    console.log('✅ Sistema de carga inicializado');
}

// Inicializar la funcionalidad de carga en el sidebar
function initializeSidebarUpload() {
    console.log('📁 Inicializando carga en sidebar...');
    
    const sidebarFileInput = document.getElementById('sidebarFileInput');
    const sidebarUploadArea = document.getElementById('sidebarUploadArea');
    
    if (!sidebarFileInput || !sidebarUploadArea) {
        console.log('⚠️ Elementos de sidebar no encontrados');
        return;
    }
    
    // Event listeners para drag & drop en sidebar
    sidebarUploadArea.addEventListener('dragover', handleSidebarDragOver);
    sidebarUploadArea.addEventListener('dragleave', handleSidebarDragLeave);
    sidebarUploadArea.addEventListener('drop', handleSidebarFileDrop);
    
    // Event listener para selección de archivos en sidebar
    sidebarFileInput.addEventListener('change', handleSidebarFileSelect);
    
    console.log('✅ Carga en sidebar inicializada');
}

// Manejar arrastre sobre el área del sidebar
function handleSidebarDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-over');
}

// Manejar salida del área de arrastre del sidebar
function handleSidebarDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
}

// Manejar archivos soltados en el sidebar
function handleSidebarFileDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    processSidebarSelectedFiles(files);
}

// Manejar archivos seleccionados en el sidebar
function handleSidebarFileSelect(e) {
    const files = e.target.files;
    processSidebarSelectedFiles(files);
}

// Procesar archivos seleccionados en el sidebar
function processSidebarSelectedFiles(files) {
    console.log(`📁 Procesando ${files.length} archivo(s) en sidebar...`);
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validar tipo de archivo
        if (!isValidExcelFile(file)) {
            alert(`❌ Archivo no válido: ${file.name}\nSolo se permiten archivos .xlsx y .xls`);
            continue;
        }
        
        // Validar tamaño (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert(`❌ Archivo muy grande: ${file.name}\nTamaño máximo permitido: 10MB`);
            continue;
        }
        
        // Agregar a la cola del sidebar
        addFileToSidebarQueue(file);
    }
    
    // Mostrar cola del sidebar si hay archivos
    if (sidebarFilesQueue.length > 0) {
        showSidebarQueue();
    }
}

// Agregar archivo a la cola del sidebar
function addFileToSidebarQueue(file) {
    const fileId = 'sidebar_file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    const fileData = {
        id: fileId,
        file: file,
        name: file.name,
        size: file.size,
        status: 'pending',
        addedAt: new Date()
    };
    
    sidebarFilesQueue.push(fileData);
    updateSidebarQueueDisplay();
    
    console.log(`✅ Archivo agregado a cola del sidebar: ${file.name}`);
}

// Mostrar la cola del sidebar
function showSidebarQueue() {
    const queueElement = document.getElementById('sidebarQueue');
    if (queueElement) {
        queueElement.style.display = 'block';
    }
}

// Actualizar la visualización de la cola del sidebar
function updateSidebarQueueDisplay() {
    const queueList = document.getElementById('sidebarFilesList');
    const queueCount = document.getElementById('queueCount');
    
    if (!queueList || !queueCount) return;
    
    // Actualizar contador
    queueCount.textContent = `${sidebarFilesQueue.length} archivo${sidebarFilesQueue.length !== 1 ? 's' : ''}`;
    
    // Limpiar lista
    queueList.innerHTML = '';
    
    // Agregar archivos
    sidebarFilesQueue.forEach(fileData => {
        const fileItem = createSidebarFileItem(fileData);
        queueList.appendChild(fileItem);
    });
}

// Crear elemento de archivo en la cola del sidebar
function createSidebarFileItem(fileData) {
    const item = document.createElement('div');
    item.className = 'sidebar-file-item';
    item.innerHTML = `
        <div class="sidebar-file-name" title="${fileData.name}">
            ${fileData.name}
        </div>
        <div class="sidebar-file-actions">
            <span class="sidebar-file-status ${fileData.status}">${getStatusText(fileData.status)}</span>
            <button class="sidebar-file-remove" onclick="removeFromSidebarQueue('${fileData.id}')" title="Remover">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    return item;
}

// Remover archivo de la cola del sidebar
function removeFromSidebarQueue(fileId) {
    sidebarFilesQueue = sidebarFilesQueue.filter(file => file.id !== fileId);
    updateSidebarQueueDisplay();
    
    // Ocultar cola si está vacía
    if (sidebarFilesQueue.length === 0) {
        const queueElement = document.getElementById('sidebarQueue');
        if (queueElement) {
            queueElement.style.display = 'none';
        }
    }
    
    console.log(`🗑️ Archivo removido de la cola del sidebar: ${fileId}`);
}

// Procesar archivos de la cola del sidebar
function processSidebarFiles() {
    if (sidebarFilesQueue.length === 0) {
        alert('No hay archivos en la cola para procesar');
        return;
    }
    
    console.log(`🔄 Iniciando procesamiento de ${sidebarFilesQueue.length} archivo(s) del sidebar...`);
    
    sidebarFilesQueue.forEach(fileData => {
        processSidebarIndividualFile(fileData);
    });
}

// Procesar un archivo individual del sidebar
function processSidebarIndividualFile(fileData) {
    // Actualizar estado a procesando
    fileData.status = 'processing';
    updateSidebarQueueDisplay();
    
    // Simular procesamiento
    setTimeout(() => {
        // Simular resultado aleatorio (90% éxito, 10% error)
        const success = Math.random() > 0.1;
        
        if (success) {
            fileData.status = 'success';
            fileData.records = Math.floor(Math.random() * 2000) + 100;
            fileData.processedAt = new Date();
            
            // Agregar al historial
            addToUploadHistory(fileData);
            
            // Mostrar en "último archivo"
            showLastUploadInfo(fileData);
            
            // Remover de la cola después de 3 segundos
            setTimeout(() => {
                removeFromSidebarQueue(fileData.id);
            }, 3000);
            
            console.log(`✅ Archivo del sidebar procesado exitosamente: ${fileData.name}`);
        } else {
            fileData.status = 'error';
            fileData.error = 'Error de formato en el archivo Excel';
            
            console.log(`❌ Error procesando archivo del sidebar: ${fileData.name}`);
        }
        
        updateSidebarQueueDisplay();
        
    }, Math.random() * 2000 + 1000); // Entre 1-3 segundos
}

// Mostrar información del último archivo procesado
function showLastUploadInfo(fileData) {
    const lastUploadInfo = document.getElementById('lastUploadInfo');
    const lastUploadDetails = document.getElementById('lastUploadDetails');
    
    if (!lastUploadInfo || !lastUploadDetails) return;
    
    lastUploadDetails.innerHTML = `
        <div><strong>${fileData.name}</strong></div>
        <div>${fileData.records} registros procesados</div>
        <div>${formatDate(fileData.processedAt)}</div>
    `;
    
    lastUploadInfo.style.display = 'block';
    
    // Ocultar después de 10 segundos
    setTimeout(() => {
        lastUploadInfo.style.display = 'none';
    }, 10000);
}

// Manejar arrastre sobre el área
function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-over');
}

// Manejar salida del área de arrastre
function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
}

// Manejar archivos soltados
function handleFileDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    processSelectedFiles(files);
}

// Manejar archivos seleccionados
function handleFileSelect(e) {
    const files = e.target.files;
    processSelectedFiles(files);
}

// Procesar archivos seleccionados
function processSelectedFiles(files) {
    console.log(`📁 Procesando ${files.length} archivo(s)...`);
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validar tipo de archivo
        if (!isValidExcelFile(file)) {
            alert(`❌ Archivo no válido: ${file.name}\nSolo se permiten archivos .xlsx y .xls`);
            continue;
        }
        
        // Validar tamaño (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert(`❌ Archivo muy grande: ${file.name}\nTamaño máximo permitido: 10MB`);
            continue;
        }
        
        // Agregar a la cola
        addFileToQueue(file);
    }
    
    // Mostrar cola si hay archivos
    if (filesQueue.length > 0) {
        showFilesQueue();
    }
}

// Validar si es un archivo Excel válido
function isValidExcelFile(file) {
    const validExtensions = ['.xlsx', '.xls'];
    const fileName = file.name.toLowerCase();
    return validExtensions.some(ext => fileName.endsWith(ext));
}

// Agregar archivo a la cola
function addFileToQueue(file) {
    const fileId = 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    const fileData = {
        id: fileId,
        file: file,
        name: file.name,
        size: file.size,
        status: 'pending',
        addedAt: new Date()
    };
    
    filesQueue.push(fileData);
    updateQueueDisplay();
    
    console.log(`✅ Archivo agregado a la cola: ${file.name}`);
}

// Mostrar la cola de archivos
function showFilesQueue() {
    const queueElement = document.getElementById('filesQueue');
    if (queueElement) {
        queueElement.style.display = 'block';
    }
}

// Actualizar la visualización de la cola
function updateQueueDisplay() {
    const queueList = document.getElementById('queueList');
    if (!queueList) return;
    
    queueList.innerHTML = '';
    
    filesQueue.forEach(fileData => {
        const fileItem = createQueueFileItem(fileData);
        queueList.appendChild(fileItem);
    });
}

// Crear elemento de archivo en la cola
function createQueueFileItem(fileData) {
    const item = document.createElement('div');
    item.className = 'queue-item';
    item.innerHTML = `
        <div class="queue-file-info">
            <div class="file-icon">
                <i class="fas fa-file-excel"></i>
            </div>
            <div class="file-details">
                <div class="file-name">${fileData.name}</div>
                <div class="file-size">${formatFileSize(fileData.size)}</div>
            </div>
        </div>
        <div class="queue-status">
            <span class="status-badge ${fileData.status}">${getStatusText(fileData.status)}</span>
        </div>
        <div class="queue-actions">
            <button class="remove-btn" onclick="removeFromQueue('${fileData.id}')" title="Remover">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    return item;
}

// Obtener texto del estado
function getStatusText(status) {
    const statusTexts = {
        'pending': 'Pendiente',
        'processing': 'Procesando',
        'success': 'Completado',
        'error': 'Error'
    };
    return statusTexts[status] || status;
}

// Formatear tamaño de archivo
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Remover archivo de la cola
function removeFromQueue(fileId) {
    filesQueue = filesQueue.filter(file => file.id !== fileId);
    updateQueueDisplay();
    
    // Ocultar cola si está vacía
    if (filesQueue.length === 0) {
        const queueElement = document.getElementById('filesQueue');
        if (queueElement) {
            queueElement.style.display = 'none';
        }
    }
    
    console.log(`🗑️ Archivo removido de la cola: ${fileId}`);
}

// Limpiar toda la cola
function clearQueue() {
    if (filesQueue.length === 0) return;
    
    if (confirm('¿Estás seguro de que deseas limpiar toda la cola de archivos?')) {
        filesQueue = [];
        updateQueueDisplay();
        
        const queueElement = document.getElementById('filesQueue');
        if (queueElement) {
            queueElement.style.display = 'none';
        }
        
        console.log('🧹 Cola de archivos limpiada');
    }
}

// Procesar todos los archivos en la cola
function processFiles() {
    if (filesQueue.length === 0) {
        alert('No hay archivos en la cola para procesar');
        return;
    }
    
    console.log(`🔄 Iniciando procesamiento de ${filesQueue.length} archivo(s)...`);
    
    filesQueue.forEach(fileData => {
        processIndividualFile(fileData);
    });
}

// Procesar un archivo individual
function processIndividualFile(fileData) {
    // Actualizar estado a procesando
    fileData.status = 'processing';
    updateQueueDisplay();
    
    // Simular procesamiento
    setTimeout(() => {
        // Simular resultado aleatorio (90% éxito, 10% error)
        const success = Math.random() > 0.1;
        
        if (success) {
            fileData.status = 'success';
            fileData.records = Math.floor(Math.random() * 2000) + 100;
            fileData.processedAt = new Date();
            
            // Agregar al historial
            addToUploadHistory(fileData);
            
            console.log(`✅ Archivo procesado exitosamente: ${fileData.name}`);
        } else {
            fileData.status = 'error';
            fileData.error = 'Error de formato en el archivo Excel';
            
            console.log(`❌ Error procesando archivo: ${fileData.name}`);
        }
        
        updateQueueDisplay();
        
        // Mostrar notificación
        showProcessNotification(fileData);
        
    }, Math.random() * 3000 + 1000); // Entre 1-4 segundos
}

// Agregar archivo al historial
function addToUploadHistory(fileData) {
    const historyItem = {
        id: fileData.id,
        name: fileData.name,
        event: generateEventName(),
        uploadDate: fileData.processedAt,
        records: fileData.records,
        status: 'success'
    };
    
    uploadHistory.unshift(historyItem);
    
    // Mantener solo los últimos 50 archivos
    if (uploadHistory.length > 50) {
        uploadHistory = uploadHistory.slice(0, 50);
    }
    
    // Guardar en localStorage
    localStorage.setItem('uploadHistory', JSON.stringify(uploadHistory));
    
    // Actualizar tabla de historial
    loadUploadHistory();
}

// Generar nombre de evento aleatorio
function generateEventName() {
    const events = [
        'Concierto Rock 2025',
        'Festival de Verano',
        'Gala Benéfica 2025',
        'Festival Indie',
        'Concierto Jazz',
        'Festival Electrónico',
        'Evento Corporativo',
        'Festival Folk',
        'Concierto Pop',
        'Festival Cultural'
    ];
    
    return events[Math.floor(Math.random() * events.length)];
}

// Mostrar notificación de procesamiento
function showProcessNotification(fileData) {
    const message = fileData.status === 'success' 
        ? `✅ ${fileData.name} procesado correctamente (${fileData.records} registros)`
        : `❌ Error procesando ${fileData.name}`;
    
    // Aquí podrías implementar un sistema de notificaciones más sofisticado
    console.log(message);
}

// Cargar historial de archivos subidos
function loadUploadHistory() {
    const historyTable = document.getElementById('filesHistory');
    if (!historyTable) return;
    
    // Limpiar tabla actual (mantener ejemplos si no hay historial)
    if (uploadHistory.length > 0) {
        historyTable.innerHTML = '';
        
        uploadHistory.forEach(item => {
            const row = createHistoryRow(item);
            historyTable.appendChild(row);
        });
    }
}

// Crear fila del historial
function createHistoryRow(item) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <div class="file-info">
                <i class="fas fa-file-excel file-icon"></i>
                <span>${item.name}</span>
            </div>
        </td>
        <td>${item.event}</td>
        <td>${formatDate(item.uploadDate)}</td>
        <td>${item.records} registros</td>
        <td><span class="status-badge ${item.status}">${getStatusText(item.status)}</span></td>
        <td>
            <button class="action-btn view" onclick="viewFile('${item.id}')" title="Ver detalles">
                <i class="fas fa-eye"></i>
            </button>
            <button class="action-btn download" onclick="downloadFile('${item.id}')" title="Descargar">
                <i class="fas fa-download"></i>
            </button>
            <button class="action-btn delete" onclick="deleteFile('${item.id}')" title="Eliminar">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    
    return row;
}

// Formatear fecha
function formatDate(date) {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('es-ES') + ' ' + d.toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'});
}

// Funciones de acciones del historial
function viewFile(fileId) {
    const file = uploadHistory.find(f => f.id === fileId);
    if (file) {
        alert(`📊 Detalles del archivo:\n\nNombre: ${file.name}\nEvento: ${file.event}\nRegistros: ${file.records}\nFecha: ${formatDate(file.uploadDate)}`);
    }
}

function downloadFile(fileId) {
    alert('🔄 Simulando descarga del archivo...\n\nEn un sistema real, aquí se descargaría el archivo procesado.');
}

function deleteFile(fileId) {
    if (confirm('¿Estás seguro de que deseas eliminar este archivo del historial?')) {
        uploadHistory = uploadHistory.filter(f => f.id !== fileId);
        localStorage.setItem('uploadHistory', JSON.stringify(uploadHistory));
        loadUploadHistory();
        
        console.log(`🗑️ Archivo eliminado del historial: ${fileId}`);
    }
}

function reprocessFile(fileId) {
    alert('🔄 Simulando reprocesamiento del archivo...\n\nEn un sistema real, aquí se reprocesaría el archivo con errores.');
}
