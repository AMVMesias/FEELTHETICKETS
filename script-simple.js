// Script simplificado para el login de Feel the Control
console.log('🚀 Script cargado correctamente');

// Usuarios predefinidos
const users = {
    jefe: [
        { id: 'FTC-JEFE-001', name: 'Director General' },
        { id: 'FTC-JEFE-002', name: 'Supervisor Principal' },
        { id: 'FTC-JEFE-003', name: 'Gerente de Operaciones' }
    ],
    staff: [
        { id: 'FTC-STAFF-001', name: 'Operador 1' },
        { id: 'FTC-STAFF-002', name: 'Operador 2' },
        { id: 'FTC-STAFF-003', name: 'Operador 3' },
        { id: 'FTC-STAFF-004', name: 'Operador 4' },
        { id: 'FTC-STAFF-005', name: 'Operador 5' }
    ]
};

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM cargado');
    
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        console.log('✅ Formulario encontrado');
        loginForm.addEventListener('submit', handleLogin);
        
        // Verificar si hay datos de sesión y limpiarlos al volver al login
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            console.log('🔄 Limpiando sesión anterior al regresar al login');
            // No remover automáticamente, solo mostrar mensaje si viene de logout
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('logout') === 'true') {
                console.log('👋 Usuario cerró sesión correctamente');
            }
        }
        
        // Cargar usuario recordado si existe
        loadRememberedUser();
        
    } else {
        console.error('❌ No se encontró el formulario de login');
    }
});

// Función principal de login
function handleLogin(event) {
    event.preventDefault();
    console.log('🔐 Iniciando login...');
    
    const userRole = document.getElementById('userRole').value;
    const userId = document.getElementById('userId').value.trim().toUpperCase();
    
    console.log('Rol:', userRole);
    console.log('ID:', userId);
    
    // Validaciones básicas
    if (!userRole) {
        alert('❌ Por favor selecciona tu rol');
        return;
    }
    
    if (!userId) {
        alert('❌ Por favor ingresa tu ID');
        return;
    }
    
    // Buscar usuario
    const userList = users[userRole];
    if (!userList) {
        alert('❌ Rol no válido');
        return;
    }
    
    const user = userList.find(u => u.id === userId);
    
    if (user) {
        console.log('✅ Usuario encontrado:', user);
        
        // Guardar en "recordarme" si está marcado
        const rememberCheckbox = document.getElementById('rememberMe');
        if (rememberCheckbox && rememberCheckbox.checked) {
            localStorage.setItem('rememberedUser', JSON.stringify({
                role: userRole,
                userId: user.id
            }));
            console.log('💾 Usuario guardado para recordar');
        }
        
        // Guardar datos del usuario actual
        localStorage.setItem('currentUser', JSON.stringify({
            id: user.id,
            name: user.name,
            role: userRole,
            loginTime: new Date().toISOString()
        }));
        
        // Mensaje de bienvenida
        alert(`🎉 ¡Bienvenido ${user.name}!\nRedirigiendo al dashboard...`);
        
        // Redirección
        if (userRole === 'jefe') {
            console.log('➡️ Redirigiendo a dashboard de jefe');
            window.location.href = 'jefe-dashboard.html';
        } else {
            console.log('➡️ Redirigiendo a dashboard de staff');
            window.location.href = 'staff-dashboard.html';
        }
        
    } else {
        const validIds = userList.map(u => u.id).join(', ');
        alert(`❌ ID no válido para ${userRole}\n\nIDs válidos:\n${validIds}`);
    }
}

// Función de debug para probar desde la consola
function testLogin(role, id) {
    document.getElementById('userRole').value = role;
    document.getElementById('userId').value = id;
    document.getElementById('loginForm').dispatchEvent(new Event('submit'));
}

// Función para cargar usuario recordado
function loadRememberedUser() {
    const remembered = localStorage.getItem('rememberedUser');
    if (remembered) {
        try {
            const userData = JSON.parse(remembered);
            const roleSelect = document.getElementById('userRole');
            const userIdInput = document.getElementById('userId');
            const rememberCheckbox = document.getElementById('rememberMe');
            
            if (roleSelect && userIdInput && rememberCheckbox) {
                roleSelect.value = userData.role;
                userIdInput.value = userData.userId;
                rememberCheckbox.checked = true;
                console.log('✅ Usuario recordado cargado:', userData.userId);
            }
        } catch (error) {
            console.error('❌ Error cargando usuario recordado:', error);
            localStorage.removeItem('rememberedUser');
        }
    }
}

console.log('📋 Script listo. Usuarios disponibles:');
console.log('Jefes:', users.jefe.map(u => u.id));
console.log('Staff:', users.staff.map(u => u.id));
console.log('💡 Para probar desde consola: testLogin("jefe", "FTC-JEFE-001")');
