# Feel the Control - Sistema de Login

## 📋 Información del Sistema

**Empresa:** Feel the Control  
**Sector:** Ticketera para eventos artísticos masivos en Ecuador  
**Funcionalidad:** Control de gastos con diferentes niveles de privilegios

---

## 👥 Usuarios Predefinidos

### 🔱 **JEFES DE TICKETERA**
Los jefes tienen control total sobre el sistema de gastos y pueden gestionar todo el personal.

| ID Usuario | Contraseña | Nombre | Privilegios |
|------------|------------|--------|-------------|
| `FTC-JEFE-001` | `admin123` | Director General | Control total del sistema |
| `FTC-JEFE-002` | `jefe456` | Supervisor Principal | Gestión completa de operaciones |
| `FTC-JEFE-003` | `control789` | Gerente de Operaciones | Supervisión de gastos y staff |

### 👥 **STAFF**
El staff tiene acceso limitado para gestionar únicamente los gastos que les han sido asignados.

| ID Usuario | Contraseña | Nombre | Privilegios |
|------------|------------|--------|-------------|
| `FTC-STAFF-001` | `staff123` | Operador 1 | Gastos asignados y reportes básicos |
| `FTC-STAFF-002` | `staff456` | Operador 2 | Gastos asignados y reportes básicos |
| `FTC-STAFF-003` | `staff789` | Operador 3 | Gastos asignados y reportes básicos |
| `FTC-STAFF-004` | `staff101` | Operador 4 | Gastos asignados y reportes básicos |
| `FTC-STAFF-005` | `staff202` | Operador 5 | Gastos asignados y reportes básicos |

---

## 🎨 Características del Diseño

### ✨ **Animaciones Incluidas**
- **Tickets flotantes**: Animación de fondo con tickets que flotan simulando boletos de eventos
- **Transiciones suaves**: Efectos de entrada y hover en todos los elementos
- **Iconos animados**: Pulso en el logo y rebote en iconos musicales
- **Efectos de botones**: Brillo deslizante y elevación al hacer hover
- **Validación visual**: Cambios de color en tiempo real para validación de campos

### 🎭 **Temática de Ticketera**
- **Colores**: Gradientes morados y azules que evocan eventos nocturnos
- **Iconos**: Tickets, música, coronas para jefes, usuarios para staff
- **Tipografía**: Fuente Poppins moderna y legible
- **Layout**: Diseño dual con panel informativo lateral

### 📱 **Responsive Design**
- Adaptación completa para dispositivos móviles
- Reordenamiento de elementos en pantallas pequeñas
- Escalado proporcional de fuentes y espacios

---

## 🔧 Funcionalidades Técnicas

### 🔐 **Sistema de Autenticación**
- Validación de credenciales contra base de datos simulada
- Formato de ID específico por rol (`FTC-JEFE-XXX` / `FTC-STAFF-XXX`)
- Opción "Recordarme" con localStorage
- Sesión guardada en sessionStorage

### ✅ **Validaciones**
- **Formato de ID**: Validación en tiempo real del formato correcto
- **Campos requeridos**: Verificación de todos los campos obligatorios
- **Credenciales**: Verificación exacta de usuario y contraseña
- **Feedback visual**: Colores y mensajes de error/éxito

### 🎯 **Experiencia de Usuario**
- **Placeholder dinámico**: Cambia según el rol seleccionado
- **Toggle de contraseña**: Mostrar/ocultar contraseña
- **Notificaciones**: Sistema de alertas con animaciones
- **Pantalla de éxito**: Vista previa del dashboard tras login exitoso

---

## 🚀 Instrucciones de Uso

### 1. **Abrir el Sistema**
Abrir el archivo `index.html` en cualquier navegador web moderno.

### 2. **Seleccionar Rol**
Elegir entre "Jefe de Ticketera" o "Staff" en el dropdown.

### 3. **Ingresar Credenciales**
- **ID único**: Seguir el formato mostrado (FTC-JEFE-XXX o FTC-STAFF-XXX)
- **Contraseña**: Usar las contraseñas de la tabla anterior

### 4. **Acceso al Sistema**
Una vez autenticado, se mostrará una vista previa del dashboard con los privilegios correspondientes.

---

## 🛠️ Estructura de Archivos

```
Interfaz-G5/
├── index.html          # Estructura HTML principal
├── styles.css          # Estilos y animaciones CSS
├── script.js           # Lógica JavaScript
└── README.md           # Esta documentación
```

---

## 🎨 Paleta de Colores

- **Primario**: #667eea (Azul violeta)
- **Secundario**: #764ba2 (Púrpura)
- **Acento**: #ffd700 (Dorado)
- **Éxito**: #27ae60 (Verde)
- **Error**: #e74c3c (Rojo)
- **Texto**: #333333 (Gris oscuro)

---

## 🔮 Próximas Funcionalidades

- Dashboard completo para cada tipo de usuario
- Sistema de gestión de gastos
- Reportes y analytics
- Gestión de eventos y tickets
- Panel de administración para jefes
- Notificaciones en tiempo real

---

**Desarrollado para Feel the Control - Sistema de Control de Gastos**  
*Ticketera especializada en eventos artísticos masivos en Ecuador*
