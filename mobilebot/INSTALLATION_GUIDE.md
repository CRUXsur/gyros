# MobileBot IMEI Reader - Guía de Instalación

## Requisitos del Sistema

### Python
- Python 3.8 o superior
- pip (gestor de paquetes Python)

### Para Dispositivos Android (ADB)
- Android SDK Platform Tools
- USB Debugging habilitado en el dispositivo
- Drivers USB del dispositivo instalados

### Para Dispositivos Serial (AT Commands)
- Drivers del dispositivo móvil
- Puerto serie disponible

## Instalación Paso a Paso

### 1. Clonar o Descargar el Proyecto

```bash
git clone <repository-url>
cd mobilebot
```

O descargar y extraer el archivo ZIP del proyecto.

### 2. Crear Entorno Virtual (Recomendado)

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 3. Instalar Dependencias

```bash
pip install -r requirements.txt
```

### 4. Configurar ADB (Para Dispositivos Android)

#### Windows:
1. Descargar Android SDK Platform Tools desde [developer.android.com](https://developer.android.com/studio/releases/platform-tools)
2. Extraer a una carpeta (ej: `C:\android-tools`)
3. Agregar la carpeta al PATH del sistema:
   - Panel de Control → Sistema → Configuración avanzada del sistema
   - Variables de entorno → PATH → Editar → Nuevo
   - Agregar `C:\android-tools`

#### Linux:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install android-tools-adb

# Fedora/CentOS
sudo dnf install android-tools

# Arch Linux
sudo pacman -S android-tools
```

#### macOS:
```bash
# Con Homebrew
brew install android-platform-tools

# O con MacPorts
sudo port install android-platform-tools
```

### 5. Verificar Instalación de ADB

```bash
adb version
```

Debería mostrar la versión de ADB instalada.

### 6. Configurar el Dispositivo Android

1. Habilitar "Opciones de desarrollador":
   - Ir a Configuración → Acerca del teléfono
   - Tocar "Número de compilación" 7 veces
   - Volver a Configuración → Opciones de desarrollador

2. Habilitar "Depuración USB"

3. Conectar el dispositivo via USB

4. Verificar conexión:
```bash
adb devices
```

### 7. Configurar Permisos (Linux/Mac)

Para dispositivos serie, puede ser necesario agregar el usuario al grupo `dialout`:

```bash
sudo usermod -a -G dialout $USER
```

Cerrar sesión y volver a iniciar para aplicar cambios.

## Instalación Mediante Setup.py

```bash
# Instalación en modo desarrollo
pip install -e .

# Instalación completa
pip install .
```

## Verificar Instalación

```bash
# Ejecutar desde código fuente
python src/main.py --version

# Si se instaló con setup.py
mobilebot --version
```

## Configuración Inicial

### Archivo de Configuración

El archivo `config.json` contiene la configuración de la aplicación. Se puede personalizar según las necesidades:

```json
{
  "logging": {
    "level": "INFO",
    "file_enabled": true,
    "console_enabled": true
  },
  "device_detection": {
    "scan_interval": 2,
    "timeout": 10,
    "retry_attempts": 3
  },
  "adb": {
    "command_timeout": 5
  },
  "serial": {
    "baudrate": 115200,
    "timeout": 1
  }
}
```

### Variables de Entorno

Se pueden usar variables de entorno para configuración:

```bash
export MOBILEBOT_LOG_LEVEL=DEBUG
export MOBILEBOT_ADB_TIMEOUT=10
export MOBILEBOT_SERIAL_BAUDRATE=9600
```

## Prueba de Funcionamiento

### Prueba Básica
```bash
python src/main.py --list-methods
```

### Prueba con Dispositivo
```bash
# Detección automática
python src/main.py

# Esperar por dispositivo Android
python src/main.py --device-type android --wait

# Modo verbose
python src/main.py --verbose
```

## Resolución de Problemas

### Problema: "ADB not found"
**Solución**: Verificar que ADB esté instalado y en el PATH del sistema.

### Problema: "Device not authorized"
**Solución**: 
1. Revisar que la depuración USB esté habilitada
2. Aceptar la autorización en el dispositivo Android
3. Ejecutar `adb devices` y aceptar la clave RSA

### Problema: "Permission denied" en puerto serie
**Solución**: 
1. Linux/Mac: Agregar usuario al grupo `dialout`
2. Windows: Ejecutar como administrador o verificar drivers

### Problema: "No devices detected"
**Solución**:
1. Verificar conexión USB
2. Revisar drivers del dispositivo
3. Probar con otro cable USB
4. Verificar que el dispositivo esté desbloqueado

### Problema: Dependencias faltantes
**Solución**:
```bash
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

## Crear Ejecutable

Para crear un ejecutable independiente:

```bash
# Instalar PyInstaller
pip install pyinstaller

# Crear ejecutable
pyinstaller --onefile --name mobilebot src/main.py

# El ejecutable estará en dist/mobilebot
```

## Soporte y Documentación

- Documentación completa: Ver `README.md`
- Ejemplos de uso: Ver `examples/`
- Reportar problemas: [GitHub Issues]
- Wiki: [GitHub Wiki]

## Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.
