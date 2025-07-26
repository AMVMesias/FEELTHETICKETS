// Dashboard de Contadora - Feel the Control
console.log('🧮 Dashboard de Contadora cargado');

// Datos simulados del staff
let staffData = [
    { id: 1, evento: 'Evento 1', cedula: '12345678', nombre: 'Juan Pérez', valor: 100, archivo: 'factura1.pdf', estado: 'Pendiente' },
    { id: 2, evento: 'Evento 1', cedula: '87654321', nombre: 'María Gómez', valor: 150, archivo: 'factura2.pdf', estado: 'Pagado', comprobante: 'comprobante1.pdf' },
    { id: 3, evento: 'Evento 1', cedula: '23456789', nombre: 'Pedro López', valor: 180, archivo: 'factura3.pdf', estado: 'Pendiente' },
    { id: 4, evento: 'Evento 1', cedula: '34567890', nombre: 'Lucía Fernández', valor: 220, archivo: 'factura4.pdf', estado: 'Pagado', comprobante: 'comprobante2.pdf' },
    { id: 5, evento: 'Evento 2', cedula: '11223344', nombre: 'Carlos López', valor: 200, archivo: 'factura5.pdf', estado: 'Pendiente' },
    { id: 6, evento: 'Evento 2', cedula: '44556677', nombre: 'Ana Martínez', valor: 250, archivo: 'factura6.pdf', estado: 'Pagado', comprobante: 'comprobante3.pdf' },
    { id: 7, evento: 'Evento 2', cedula: '55667788', nombre: 'José Rodríguez', valor: 190, archivo: 'factura7.pdf', estado: 'Pendiente' },
    { id: 8, evento: 'Evento 2', cedula: '66778899', nombre: 'Elena Castro', valor: 170, archivo: 'factura8.pdf', estado: 'Pagado', comprobante: 'comprobante4.pdf' },
    { id: 9, evento: 'Evento 3', cedula: '55667788', nombre: 'Luis Rodríguez', valor: 300, archivo: 'factura9.pdf', estado: 'Pendiente' },
    { id: 10, evento: 'Evento 3', cedula: '99887766', nombre: 'Patricia Sánchez', valor: 120, archivo: 'factura10.pdf', estado: 'Pagado', comprobante: 'comprobante5.pdf' },
    { id: 11, evento: 'Evento 3', cedula: '11223399', nombre: 'Mario Díaz', valor: 250, archivo: 'factura11.pdf', estado: 'Pendiente' },
    { id: 12, evento: 'Evento 3', cedula: '22334455', nombre: 'Isabel Torres', valor: 200, archivo: 'factura12.pdf', estado: 'Pagado', comprobante: 'comprobante6.pdf' }
];

// Elementos del DOM
const eventoSelect = document.getElementById('eventoSelect');
const estadoSelectContainer = document.getElementById('estadoSelectContainer');
const estadoSelect = document.getElementById('estadoSelect');
const tablaContainer = document.getElementById('tablaContainer');
const staffTableBody = document.getElementById('staffTableBody');
const noDataMessage = document.getElementById('noDataMessage');

// Elementos de resumen
const totalStaffElement = document.getElementById('totalStaff');
const pagosPendientesElement = document.getElementById('pagosPendientes');
const pagosRealizadosElement = document.getElementById('pagosRealizados');
const totalPagarElement = document.getElementById('totalPagar');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    updateDateTime();
    updateSummary();
    
    // Actualizar fecha/hora cada minuto
    setInterval(updateDateTime, 60000);
});

function initializeDashboard() {
    // Cargar información del usuario
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (currentUser.name) {
        document.getElementById('userName').textContent = currentUser.name;
    }
    
    console.log('✅ Dashboard inicializado para:', currentUser.name);
}

function setupEventListeners() {
    // Evento para selección de evento
    eventoSelect.addEventListener('change', handleEventoChange);
    
    // Evento para selección de estado
    estadoSelect.addEventListener('change', handleEstadoChange);
    
    // Navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover clase active de todos los links
            document.querySelectorAll('.nav-link').forEach(l => l.parentElement.classList.remove('active'));
            
            // Agregar clase active al link clickeado
            this.parentElement.classList.add('active');
            
            const section = this.getAttribute('href').substring(1);
            console.log('Navegando a sección:', section);
        });
    });
}

function handleEventoChange() {
    const selectedEvento = eventoSelect.value;
    
    if (selectedEvento) {
        estadoSelectContainer.style.display = 'block';
        estadoSelect.value = '';
        hideTable();
        updateSummaryByEvent(selectedEvento);
    } else {
        estadoSelectContainer.style.display = 'none';
        estadoSelect.value = '';
        hideTable();
        updateSummary();
    }
}

function handleEstadoChange() {
    const selectedEvento = eventoSelect.value;
    const selectedEstado = estadoSelect.value;
    
    if (selectedEstado && selectedEvento) {
        renderTable(selectedEvento, selectedEstado);
    } else {
        hideTable();
    }
}

function renderTable(evento, estado) {
    const filteredStaff = staffData.filter(staff => 
        staff.evento === evento && staff.estado === estado
    );
    
    staffTableBody.innerHTML = '';
    
    if (filteredStaff.length === 0) {
        showNoData();
        return;
    }
    
    filteredStaff.forEach(staff => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${staff.cedula}</td>
            <td>${staff.nombre}</td>
            <td><strong>$${staff.valor}</strong></td>
            <td>
                <button class="action-btn btn-view" onclick="openFile('${staff.archivo}')">
                    <i class="fas fa-file-pdf"></i> Ver Archivo
                </button>
            </td>
            <td>
                <span class="status-badge status-${staff.estado.toLowerCase()}">
                    ${staff.estado}
                </span>
            </td>
            <td>
                ${generateActionButtons(staff)}
            </td>
        `;
        staffTableBody.appendChild(row);
    });
    
    showTable();
}

function generateActionButtons(staff) {
    if (staff.estado === 'Pendiente') {
        return `
            <button class="action-btn btn-pay" onclick="handlePagar(${staff.id})">
                <i class="fas fa-dollar-sign"></i> Marcar Pagado
            </button>
        `;
    } else {
        return `
            <button class="action-btn btn-receipt" onclick="openComprobante('${staff.comprobante}')">
                <i class="fas fa-receipt"></i> Ver Comprobante
            </button>
        `;
    }
}

function showTable() {
    tablaContainer.style.display = 'block';
    noDataMessage.style.display = 'none';
}

function hideTable() {
    tablaContainer.style.display = 'none';
    noDataMessage.style.display = 'block';
}

function showNoData() {
    tablaContainer.style.display = 'none';
    noDataMessage.style.display = 'block';
}

function openFile(archivo) {
    alert(`📄 Abriendo archivo: ${archivo}\n\nEn un sistema real, esto abriría el archivo PDF correspondiente.`);
}

function openComprobante(comprobante) {
    alert(`🧾 Abriendo comprobante: ${comprobante}\n\nEn un sistema real, esto abriría el comprobante de pago.`);
}

function handlePagar(id) {
    const staff = staffData.find(s => s.id === id);
    
    if (!staff) return;
    
    if (confirm(`💰 ¿Confirmas el pago a ${staff.nombre} por $${staff.valor}?`)) {
        // Simular subida de comprobante
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.pdf,.jpg,.png';
        fileInput.onchange = (e) => {
            if (e.target.files.length > 0) {
                const fileName = e.target.files[0].name;
                
                // Actualizar el estado del staff
                staffData = staffData.map(s =>
                    s.id === id
                        ? { ...s, estado: 'Pagado', comprobante: fileName }
                        : s
                );
                
                alert(`✅ Pago registrado exitosamente para ${staff.nombre}\nComprobante: ${fileName}`);
                
                // Refrescar la tabla si está visible
                const selectedEvento = eventoSelect.value;
                const selectedEstado = estadoSelect.value;
                if (selectedEvento && selectedEstado) {
                    renderTable(selectedEvento, selectedEstado);
                }
                
                // Actualizar resumen
                updateSummaryByEvent(selectedEvento);
            }
        };
        fileInput.click();
    }
}

function updateSummary() {
    const totalStaff = staffData.length;
    const pendientes = staffData.filter(s => s.estado === 'Pendiente').length;
    const pagados = staffData.filter(s => s.estado === 'Pagado').length;
    const totalPagar = staffData
        .filter(s => s.estado === 'Pendiente')
        .reduce((total, s) => total + s.valor, 0);
    
    totalStaffElement.textContent = totalStaff;
    pagosPendientesElement.textContent = pendientes;
    pagosRealizadosElement.textContent = pagados;
    totalPagarElement.textContent = `$${totalPagar}`;
}

function updateSummaryByEvent(evento) {
    const eventStaff = staffData.filter(s => s.evento === evento);
    const totalStaff = eventStaff.length;
    const pendientes = eventStaff.filter(s => s.estado === 'Pendiente').length;
    const pagados = eventStaff.filter(s => s.estado === 'Pagado').length;
    const totalPagar = eventStaff
        .filter(s => s.estado === 'Pendiente')
        .reduce((total, s) => total + s.valor, 0);
    
    totalStaffElement.textContent = totalStaff;
    pagosPendientesElement.textContent = pendientes;
    pagosRealizadosElement.textContent = pagados;
    totalPagarElement.textContent = `$${totalPagar}`;
}

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
    
    document.getElementById('dateTime').textContent = 
        now.toLocaleDateString('es-ES', options);
}

// Función de logout
function logout() {
    if (confirm('¿Estás seguro de que deseas cerrar la sesión?')) {
        console.log('🚪 Cerrando sesión...');
        
        // Limpiar datos de sesión
        localStorage.removeItem('currentUser');
        localStorage.removeItem('rememberedUser');
        
        // Mostrar mensaje de despedida
        alert('👋 Sesión cerrada correctamente. Redirigiendo al login...');
        
        // Redireccionar al login
        window.location.href = 'index.html';
    }
}

// Funciones de exportación y reportes
function exportarDatos() {
    const evento = eventoSelect.value;
    const estado = estadoSelect.value;
    
    if (!evento || !estado) {
        alert('❌ Selecciona un evento y estado para exportar');
        return;
    }
    
    const filteredData = staffData.filter(s => s.evento === evento && s.estado === estado);
    
    if (filteredData.length === 0) {
        alert('❌ No hay datos para exportar');
        return;
    }
    
    // Simular exportación
    alert(`📊 Exportando ${filteredData.length} registros de ${evento} - ${estado}\n\nEn un sistema real, esto generaría un archivo Excel o PDF.`);
}

function generarReporte() {
    alert('📈 Generando reporte financiero...\n\nEn un sistema real, esto crearía un reporte detallado con gráficos y estadísticas.');
}

console.log('✅ Dashboard de Contadora listo');
console.log('📊 Total de registros de staff:', staffData.length);
