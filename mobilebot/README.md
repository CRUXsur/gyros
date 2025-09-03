# Instalar dependencias (YA HECHO)
   ```bash
    pip install -r requirements.txt
   ```

# Detectar dispositivos
    ```bash
    python3 src/main.py --list-devices
   ```

# Leer IMEI (automático)
    ```bash
    python3 src/main.py
   ```

# Modo verbose para depuración
   ```bash
    python3 src/main.py --verbose
   ```

# Esperar por dispositivo específico
   ```bash
    python3 src/main.py --device-type android --wait
   ```

# ID único 
   ```bash
    python3 src/main.py --list-devices --verbose
   ```

Obtenemos:  
    
    Device ID: NBA34BOAC5036471  # ← Único para tu ZTE
    Model: ZTE_Blade_A34
    Product: P963F94
    Transport: usb:2-1







# MobileBot - IMEI Reader Automation

## Descripción
Aplicación Python para automatizar la lectura del IMEI de dispositivos móviles conectados por USB. Soporta múltiples métodos de conexión incluyendo ADB (Android Debug Bridge) y comandos AT.

## Características
- ✅ Detección automática de dispositivos USB conectados
- ✅ Lectura de IMEI via ADB para dispositivos Android
- ✅ Lectura de IMEI via comandos AT para dispositivos compatibles
- ✅ Salida de consola con formato de console.log
- ✅ Manejo de errores robusto
- ✅ Logging detallado
- ✅ Configuración flexible

## Estructura del Proyecto
```
mobilebot/
├── src/
│   ├── __init__.py
│   ├── main.py                 # Punto de entrada principal
│   ├── core/
│   │   ├── __init__.py
│   │   ├── device_detector.py  # Detección de dispositivos USB
│   │   ├── imei_reader.py      # Lógica principal de lectura IMEI
│   │   └── config.py           # Configuración de la aplicación
│   ├── methods/
│   │   ├── __init__.py
│   │   ├── adb_method.py       # Método ADB para Android
│   │   ├── at_commands.py      # Método comandos AT
│   │   └── base_method.py      # Clase base para métodos
│   └── utils/
│       ├── __init__.py
│       ├── logger.py           # Sistema de logging
│       └── helpers.py          # Funciones auxiliares
├── requirements.txt            # Dependencias Python
├── setup.py                   # Instalación del paquete
├── config.json               # Archivo de configuración
├── logs/                     # Directorio de logs
└── tests/                    # Tests unitarios
    ├── __init__.py
    ├── test_adb_method.py
    ├── test_at_commands.py
    └── test_device_detector.py
```

## Instalación
1. Crear entorno virtual:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```

2. Instalar dependencias:
   ```bash
   pip install -r requirements.txt
   ```

3. Configurar ADB (para dispositivos Android):
   - Descargar Android SDK Platform Tools
   - Agregar ADB al PATH del sistema
   - Habilitar depuración USB en el dispositivo

## Uso
```bash
python src/main.py
```

## Métodos Soportados
1. **ADB (Android Debug Bridge)** - Para dispositivos Android
2. **Comandos AT** - Para dispositivos con interfaz serie
3. **Detección automática** - Selecciona el método apropiado

## Requisitos del Sistema
- Python 3.8+
- Puerto USB disponible
- ADB instalado (para dispositivos Android)
- Permisos de acceso a dispositivos USB

## Licencia
MIT License




