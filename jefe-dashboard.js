// Dashboard Jefe - Feel the Control
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    startRealTimeUpdates();
});

// Inicialización del dashboard
function initializeDashboard() {
    console.log('=== INICIANDO DASHBOARD JEFE ===');
    
    // Verificar autenticación
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log('Usuario encontrado:', currentUser);
    
    if (!currentUser) {
        console.log('No hay usuario logueado, redirigiendo al login...');
        alert('No hay sesión activa. Serás redirigido al login.');
        window.location.href = 'index.html';
        return;
    }
    
    if (currentUser.role !== 'jefe') {
        console.log('Usuario no es jefe, redirigiendo...');
        alert('Acceso denegado. Este dashboard es solo para jefes.');
        window.location.href = 'index.html';
        return;
    }
    
    // Actualizar nombre del usuario en la interfaz
    const userNameElement = document.getElementById('userName');
    if (userNameElement && currentUser.name) {
        userNameElement.textContent = currentUser.name;
    }
    
    console.log('Dashboard jefe inicializado correctamente para:', currentUser.name);
    
    // Actualizar fecha y hora
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Cargar datos iniciales
    loadDashboardData();
    
    // Configurar navegación
    setupNavigation();
}

// Configurar event listeners
function setupEventListeners() {
    // Toggle sidebar en móvil
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    // Navegación del sidebar
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Botones de aprobación/rechazo
    const approveButtons = document.querySelectorAll('.approve-btn');
    const rejectButtons = document.querySelectorAll('.reject-btn');
    
    approveButtons.forEach(btn => {
        btn.addEventListener('click', (e) => handleApproval(e, 'approve'));
    });
    
    rejectButtons.forEach(btn => {
        btn.addEventListener('click', (e) => handleApproval(e, 'reject'));
    });
    
    // Notificaciones
    const notificationBtn = document.querySelector('.notification-btn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', showNotifications);
    }
}

// Actualizar fecha y hora
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

// Toggle sidebar móvil
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('mobile-open');
}

// Navegación
function setupNavigation() {
    const sections = ['dashboard', 'gastos', 'personal', 'eventos', 'reportes', 'configuracion'];
    
    // Mostrar solo dashboard inicialmente
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            element.style.display = section === 'dashboard' ? 'block' : 'none';
        }
    });
}

function handleNavigation(e) {
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
    showSection(section);
}

function showSection(sectionName) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('[id^="dashboard"], [id^="gastos"], [id^="personal"], [id^="eventos"], [id^="reportes"], [id^="configuracion"]');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Mostrar la sección seleccionada
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.style.display = 'block';
    } else {
        // Si no existe la sección, mostrar dashboard
        document.getElementById('dashboard').style.display = 'block';
        showModal('info', 'Sección en Desarrollo', 'Esta funcionalidad estará disponible próximamente.');
    }
}

// Cargar datos del dashboard
function loadDashboardData() {
    // Simular carga de datos
    animateNumbers();
    loadRecentActivities();
    loadPendingApprovals();
}

// Animar números en las estadísticas
function animateNumbers() {
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(element => {
        const finalValue = element.textContent;
        if (finalValue.includes('$')) {
            animateNumber(element, finalValue);
        }
    });
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
            element.textContent = '$' + current.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        }
    }, duration / steps);
}

// Cargar actividades recientes
function loadRecentActivities() {
    // Datos simulados - en producción vendrían del backend
    const activities = [
        {
            type: 'success',
            icon: 'fas fa-check',
            message: '<strong>María González</strong> registró gasto de $250.00',
            time: 'Hace 2 horas'
        },
        {
            type: 'warning',
            icon: 'fas fa-exclamation',
            message: '<strong>Carlos Ruiz</strong> excedió límite presupuestario',
            time: 'Hace 4 horas'
        },
        {
            type: 'info',
            icon: 'fas fa-info',
            message: 'Nuevo evento <strong>"Concierto Rock 2025"</strong> creado',
            time: 'Hace 6 horas'
        }
    ];
    
    updateActivityFeed(activities);
}

function updateActivityFeed(activities) {
    const container = document.querySelector('.activities-list');
    if (!container) return;
    
    container.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon ${activity.type}">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <p>${activity.message}</p>
                <span class="activity-time">${activity.time}</span>
            </div>
        </div>
    `).join('');
}

// Cargar gastos pendientes de aprobación
function loadPendingApprovals() {
    // Datos simulados
    const pendingApprovals = [
        {
            id: 1,
            title: 'Compra Equipo de Sonido',
            requester: 'Pedro Martínez',
            amount: 1250.00,
            status: 'pending'
        },
        {
            id: 2,
            title: 'Catering Evento VIP',
            requester: 'Laura Vega',
            amount: 850.00,
            status: 'pending'
        },
        {
            id: 3,
            title: 'Transporte Personal',
            requester: 'Roberto Silva',
            amount: 320.00,
            status: 'pending'
        }
    ];
    
    updateApprovalsWidget(pendingApprovals);
}

function updateApprovalsWidget(approvals) {
    const container = document.querySelector('.approvals-list');
    if (!container) return;
    
    container.innerHTML = approvals.map(approval => `
        <div class="approval-item" data-id="${approval.id}">
            <div class="approval-info">
                <h4>${approval.title}</h4>
                <p>Solicitado por: <strong>${approval.requester}</strong></p>
                <span class="amount">$${approval.amount.toFixed(2)}</span>
            </div>
            <div class="approval-actions">
                <button class="approve-btn" onclick="handleApproval(event, 'approve')">Aprobar</button>
                <button class="reject-btn" onclick="handleApproval(event, 'reject')">Rechazar</button>
            </div>
        </div>
    `).join('');
}

// Manejar aprobaciones/rechazos
function handleApproval(event, action) {
    event.preventDefault();
    const approvalItem = event.target.closest('.approval-item');
    const approvalId = approvalItem.dataset.id;
    
    const actionText = action === 'approve' ? 'aprobar' : 'rechazar';
    const actionPast = action === 'approve' ? 'aprobado' : 'rechazado';
    
    showConfirmModal(
        `¿Confirmar ${actionText}?`,
        `¿Estás seguro de que deseas ${actionText} esta solicitud de gasto?`,
        () => {
            // Simular aprobación/rechazo
            approvalItem.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            approvalItem.style.opacity = '0.5';
            approvalItem.style.transform = 'translateX(20px)';
            
            setTimeout(() => {
                approvalItem.remove();
                showModal('success', 'Acción Completada', `La solicitud ha sido ${actionPast} exitosamente.`);
                updatePendingCount();
            }, 300);
        }
    );
}

function updatePendingCount() {
    const pendingItems = document.querySelectorAll('.approval-item').length;
    const countElement = document.querySelector('.pending-count');
    if (countElement) {
        countElement.textContent = pendingItems;
    }
}

// Mostrar notificaciones
function showNotifications() {
    const notifications = [
        {
            type: 'warning',
            message: 'Presupuesto del mes al 85% de su límite',
            time: 'Hace 1 hora'
        },
        {
            type: 'info',
            message: '3 nuevas solicitudes de gasto pendientes',
            time: 'Hace 2 horas'
        },
        {
            type: 'success',
            message: 'Reporte mensual generado exitosamente',
            time: 'Hace 3 horas'
        }
    ];
    
    const notificationsList = notifications.map(notif => `
        <div class="notification-item">
            <div class="notification-icon ${notif.type}">
                <i class="fas fa-${notif.type === 'warning' ? 'exclamation-triangle' : notif.type === 'info' ? 'info-circle' : 'check-circle'}"></i>
            </div>
            <div class="notification-content">
                <p>${notif.message}</p>
                <span class="notification-time">${notif.time}</span>
            </div>
        </div>
    `).join('');
    
    showModal('info', 'Notificaciones', notificationsList);
}

// Modal para acciones rápidas
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

function showConfirmModal(title, message, onConfirm) {
    showModal('warning', title, message, onConfirm);
}

function closeModal() {
    const modalContainer = document.getElementById('modalContainer');
    modalContainer.innerHTML = '';
    
    // Limpiar event listeners
    delete window.confirmAction;
}

// Funciones para acciones rápidas
function generateReport() {
    showModal('info', 'Generando Reporte', 'El reporte se está generando. Recibirás una notificación cuando esté listo.');
}

// Logout
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

// Actualizaciones en tiempo real
function startRealTimeUpdates() {
    // Simular actualizaciones cada 30 segundos
    setInterval(() => {
        updateDashboardStats();
    }, 30000);
}

function updateDashboardStats() {
    // Simular cambios en las estadísticas
    const gastosTotales = document.querySelector('.total-gastos .stat-value');
    const eventosActivos = document.querySelector('.eventos-activos .stat-value');
    
    if (gastosTotales) {
        // Simular pequeños cambios en los gastos
        const currentValue = parseFloat(gastosTotales.textContent.replace(/[$,]/g, ''));
        const newValue = currentValue + (Math.random() * 100 - 50);
        gastosTotales.textContent = '$' + newValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    }
}

// Funciones para los modales de creación
window.showModal = function(modalType) {
    switch(modalType) {
        case 'newExpense':
            showNewExpenseModal();
            break;
        case 'newEvent':
            showNewEventModal();
            break;
        case 'addStaff':
            showAddStaffModal();
            break;
        default:
            showModal('info', 'Funcionalidad', 'Esta funcionalidad estará disponible próximamente.');
    }
};

function showNewExpenseModal() {
    const form = `
        <form id="newExpenseForm" class="modal-form">
            <div class="form-group">
                <label>Título del Gasto</label>
                <input type="text" name="title" required placeholder="Ej: Compra de equipos">
            </div>
            <div class="form-group">
                <label>Monto</label>
                <input type="number" name="amount" required placeholder="0.00" step="0.01">
            </div>
            <div class="form-group">
                <label>Categoría</label>
                <select name="category" required>
                    <option value="">Seleccionar categoría</option>
                    <option value="equipos">Equipos</option>
                    <option value="transporte">Transporte</option>
                    <option value="alimentacion">Alimentación</option>
                    <option value="materiales">Materiales</option>
                    <option value="otros">Otros</option>
                </select>
            </div>
            <div class="form-group">
                <label>Descripción</label>
                <textarea name="description" placeholder="Descripción detallada del gasto"></textarea>
            </div>
        </form>
    `;
    
    showModal('info', 'Nuevo Gasto', form, () => {
        const formData = new FormData(document.getElementById('newExpenseForm'));
        // Aquí se enviaría al backend
        showModal('success', 'Gasto Creado', 'El gasto ha sido registrado exitosamente.');
    });
}

function showNewEventModal() {
    const form = `
        <form id="newEventForm" class="modal-form">
            <div class="form-group">
                <label>Nombre del Evento</label>
                <input type="text" name="eventName" required placeholder="Ej: Concierto de Rock">
            </div>
            <div class="form-group">
                <label>Fecha</label>
                <input type="date" name="eventDate" required>
            </div>
            <div class="form-group">
                <label>Ubicación</label>
                <input type="text" name="location" required placeholder="Ej: Estadio Nacional">
            </div>
            <div class="form-group">
                <label>Presupuesto</label>
                <input type="number" name="budget" required placeholder="0.00" step="0.01">
            </div>
            <div class="form-group">
                <label>Descripción</label>
                <textarea name="description" placeholder="Descripción del evento"></textarea>
            </div>
        </form>
    `;
    
    showModal('info', 'Nuevo Evento', form, () => {
        const formData = new FormData(document.getElementById('newEventForm'));
        showModal('success', 'Evento Creado', 'El evento ha sido creado exitosamente.');
    });
}

function showAddStaffModal() {
    const form = `
        <form id="addStaffForm" class="modal-form">
            <div class="form-group">
                <label>Nombre Completo</label>
                <input type="text" name="fullName" required placeholder="Ej: Juan Pérez">
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" required placeholder="juan@ejemplo.com">
            </div>
            <div class="form-group">
                <label>Rol</label>
                <select name="role" required>
                    <option value="">Seleccionar rol</option>
                    <option value="staff">Staff</option>
                    <option value="supervisor">Supervisor</option>
                </select>
            </div>
            <div class="form-group">
                <label>Límite de Gastos Mensual</label>
                <input type="number" name="monthlyLimit" required placeholder="0.00" step="0.01">
            </div>
        </form>
    `;
    
    showModal('info', 'Agregar Personal', form, () => {
        const formData = new FormData(document.getElementById('addStaffForm'));
        showModal('success', 'Personal Agregado', 'El nuevo miembro del personal ha sido agregado exitosamente.');
    });
}
