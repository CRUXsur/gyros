# 🤖 Sistema de Automatización Gyros

## Resumen Ejecutivo

El Sistema de Automatización Gyros es una integración completa entre **NestJS**, **Robot Framework** y **PostgreSQL** que permite la detección automática de dispositivos USB Android y la gestión automatizada de préstamos basada en el device_id del dispositivo conectado.

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   NestJS API    │    │  Python/Robot   │
│   (Cliente)     │◄──►│  (Orchestrator) │◄──►│   Framework     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   PostgreSQL    │    │  Dispositivo    │
                       │   (Database)    │    │  Android USB    │
                       └─────────────────┘    └─────────────────┘
```

## 🔧 Componentes Principales

### 1. **NestJS API (Orchestrator)**
- **Puerto**: 3001
- **Función**: Director de orquesta central
- **Módulos**:
  - `AutomationModule`: Lógica principal de automatización
  - `PythonExecutorService`: Ejecutor de scripts Python
  - `AutomationService`: Orquestación de procesos

### 2. **Robot Framework + Python**
- **Script Principal**: `automation_interface.py`
- **Utilidades**: `Utility.py` (detección ADB)
- **Función**: Detección y comunicación con dispositivos Android

### 3. **PostgreSQL Database**
- **Tablas Principales**:
  - `clients`: Información de clientes con device_id
  - `prestamos`: Préstamos con estado isActive
  - `automation_logs`: Logs de procesos de automatización

## 📡 APIs Disponibles

### Endpoints de Automatización

#### `GET /api/automation/check-device-id`
**Descripción**: Detecta dispositivo USB y valida cliente en base de datos

**Respuesta**:
```json
{
  "success": true,
  "deviceId": "NBA34BOAC5036471",
  "cliente": {
    "id_cliente": "fd45e343-cd8c-4318-a777-fcdaade5fa26",
    "nombres": "Andres Santino",
    "apellidos": "Torrico",
    "device_id": "NBA34BOAC5036471"
  },
  "hasActiveLoans": true,
  "activeLoans": [/* array de préstamos */],
  "message": "Cliente encontrado con 1 préstamo(s) activo(s)"
}
```

#### `POST /api/automation/start-process`
**Descripción**: Ejecuta proceso completo de automatización

**Body**:
```json
{
  "action": "toggle_prestamo_status|execute_robot_action|check_device_only",
  "newStatus": false,  // Solo para toggle_prestamo_status
  "notes": "Descripción opcional"
}
```

**Respuesta**:
```json
{
  "success": true,
  "result": {
    "deviceId": "NBA34BOAC5036471",
    "cliente": {/* datos del cliente */},
    "action": "toggle_prestamo_status",
    "result": {
      "prestamoId": "51a51ae6-c240-4250-afb8-c70efef3973b",
      "previousStatus": true,
      "newStatus": false
    }
  },
  "message": "Proceso de automatización completado exitosamente"
}
```

#### `GET /api/automation/status`
**Descripción**: Estado actual del sistema de automatización

#### `GET /api/automation/history`
**Descripción**: Historial de procesos ejecutados

#### `POST /api/automation/trigger-scheduled-check`
**Descripción**: Ejecuta manualmente las verificaciones programadas

## 🔄 Flujos de Trabajo

### Flujo Principal: Detección y Toggle de Préstamos

1. **Detección de Dispositivo**
   ```
   Cliente → USB Port → ADB → Python Script → Device ID
   ```

2. **Validación de Cliente**
   ```
   Device ID → PostgreSQL Query → Cliente Match → Préstamos Activos
   ```

3. **Acción Automatizada**
   ```
   Cliente Válido → Robot Action → Toggle Préstamo → Log Proceso
   ```

4. **Respuesta al Cliente**
   ```
   Resultado → JSON Response → Frontend/API Consumer
   ```

### Flujo de Cron Jobs Automáticos

```
Cada Hora (0 * * * *):
├── Detectar dispositivos USB
├── Validar clientes automáticamente
├── Log de detecciones
└── Generar métricas

Diario (00:00):
├── Generar reporte del día
├── Calcular estadísticas
└── Limpiar logs antiguos (opcional)

Mensual (1er día 00:00):
├── Mantenimiento de base de datos
├── Limpiar logs >3 meses
└── Generar reporte mensual
```

## 🐍 Scripts Python/Robot

### `automation_interface.py`
**Funciones Principales**:

```python
class AutomationInterface:
    def check_device_and_execute(action_type: str) -> Dict[str, Any]
    
    # Acciones disponibles:
    # - "check_device": Solo verificar dispositivo
    # - "make_action": Ejecutar acción completa + Robot
    # - "get_device_info": Información detallada del dispositivo
```

**Uso desde Terminal**:
```bash
# Verificar dispositivo
python3 automation_interface.py check_device

# Ejecutar acción completa
python3 automation_interface.py make_action

# Obtener información detallada
python3 automation_interface.py get_device_info
```

### `Utility.py` (Módulo Base)
**Funciones Principales**:
- `get_connected_device_id()`: Detecta dispositivos via ADB
- `validate_device_connection(device_id)`: Valida conectividad
- `get_device_info(device_id)`: Información del dispositivo

## 📊 Base de Datos

### Tabla: `automation_logs`
```sql
CREATE TABLE automation_logs (
  id UUID PRIMARY KEY,
  deviceId TEXT NOT NULL,
  action TEXT NOT NULL,
  result JSON,
  timestamp TIMESTAMP DEFAULT NOW(),
  success BOOLEAN DEFAULT FALSE,
  notes TEXT,
  clienteId UUID REFERENCES clientes(id_cliente),
  userId UUID REFERENCES users(id)
);
```

### Índices Recomendados
```sql
CREATE INDEX idx_automation_logs_timestamp ON automation_logs(timestamp DESC);
CREATE INDEX idx_automation_logs_device ON automation_logs(deviceId);
CREATE INDEX idx_automation_logs_success ON automation_logs(success);
```

## 🔧 Configuración y Instalación

### Requisitos del Sistema
- **Node.js**: v18+
- **Python**: 3.8+
- **ADB**: Android Debug Bridge
- **PostgreSQL**: 12+

### Variables de Entorno
```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gyros_db
DB_USERNAME=postgres
DB_PASSWORD=password

# JWT
JWT_SECRET=your-secret-key

# Server
PORT=3001
```

### Instalación
```bash
# Backend
cd backend
yarn install
yarn build
yarn start:dev

# Robot Framework (verificar dependencias)
cd ../robot
python3 -m pip install -r requirements.txt  # si existe
```

## 🚀 Comandos de Prueba

### Verificar Sistema Completo
```bash
# 1. Verificar servidor
curl http://localhost:3001/api

# 2. Login y obtener token
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@automation.com","password":"TestPass123!"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# 3. Probar detección de dispositivo
curl -X GET http://localhost:3001/api/automation/check-device-id \
  -H "Authorization: Bearer $TOKEN"

# 4. Probar proceso completo
curl -X POST http://localhost:3001/api/automation/start-process \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action":"toggle_prestamo_status","newStatus":false}'
```

### Verificar Python/Robot Independiente
```bash
cd robot

# Verificar detección
python3 test_device_detection.py

# Probar interfaz
python3 automation_interface.py check_device
python3 automation_interface.py make_action
```

## 📈 Métricas y Monitoreo

### Endpoints de Métricas
- `GET /api/automation/status`: Estado del sistema
- `GET /api/automation/history?limit=50`: Historial reciente

### Logs del Sistema
- **NestJS Logs**: Información de procesos y errores
- **Database Logs**: Todos los procesos en `automation_logs`
- **Python Logs**: Salida detallada de scripts

### Métricas Clave
- **Tasa de Éxito**: Porcentaje de procesos exitosos
- **Detecciones por Día**: Dispositivos detectados
- **Tiempo de Respuesta**: Latencia de procesos
- **Errores por Tipo**: Categorización de fallos

## 🛡️ Seguridad

### Autenticación
- **JWT Tokens**: Todos los endpoints requieren autenticación
- **Roles**: Admin, User, Super-User
- **Expiración**: Tokens válidos por 2 horas

### Autorización
- `check-device-id`: Usuarios autenticados
- `start-process`: Usuarios autenticados
- `history`: Solo administradores
- `trigger-scheduled-check`: Solo administradores

## 🐛 Troubleshooting

### Problemas Comunes

#### "No device found"
```bash
# Verificar ADB
adb devices

# Verificar permisos USB
adb kill-server
sudo adb start-server
```

#### "Cliente no encontrado"
- Verificar que el device_id esté registrado en la tabla `clientes`
- Confirmar que el dispositivo esté reportando el device_id correcto

#### "Error de compilación TypeScript"
```bash
cd backend
yarn build
# Revisar errores de tipos
```

#### "Error de conexión a base de datos"
- Verificar que PostgreSQL esté ejecutándose
- Confirmar variables de entorno
- Verificar conectividad de red

## 📞 Soporte

### Logs de Debug
```bash
# Ver logs del servidor
tail -f backend/logs/app.log

# Ver logs de Python
cd robot && python3 automation_interface.py check_device 2>&1 | tee debug.log
```

### Contacto Técnico
- **Equipo**: QuanticaSoft
- **Proyecto**: Gyros - Sistema de Automatización
- **Versión**: 1.0.0
- **Fecha**: Septiembre 2025

---

## 🎯 Roadmap Futuro

### Mejoras Planificadas
- [ ] WebSockets para notificaciones en tiempo real
- [ ] Dashboard web para monitoreo
- [ ] Soporte para múltiples dispositivos simultáneos
- [ ] Integración con más tipos de dispositivos
- [ ] API de webhooks para integraciones externas

### Optimizaciones
- [ ] Cache de detecciones de dispositivos
- [ ] Compresión de logs antiguos
- [ ] Métricas avanzadas con Prometheus
- [ ] Alertas automáticas por errores

---

**¡El Sistema de Automatización Gyros está completamente operativo y listo para producción!** 🚀
