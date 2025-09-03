# MobileBot IMEI Reader - Ejemplos de Uso

## Casos de Uso Básicos

### 1. Lectura Automática de IMEI

```bash
# Detección automática y lectura
python src/main.py
```

**Salida esperada:**
```
🔍 Scanning for connected mobile devices...
📱 Found device: android - {'device_id': 'ABC123', 'status': 'device'}
🔧 Attempting to read IMEI from android device...
⚡ Trying ADBMethod...
✅ IMEI successfully read: 123456789012345

==================================================
📱 MOBILE DEVICE IMEI READER
==================================================
⏰ Timestamp: 2024-01-15T10:30:45.123456
📋 IMEI: 123456789012345
🔧 Method: ADBMethod(service call iphonesubinfo 1)
📱 Device Type: android
📊 Device Information:
   device_id: ABC123
   status: device
   adb_path: adb
==================================================
```

### 2. Esperar por Dispositivo

```bash
# Esperar hasta que se conecte un dispositivo
python src/main.py --wait
```

### 3. Esperar por Tipo Específico

```bash
# Esperar por dispositivo Android
python src/main.py --device-type android --wait

# Esperar por dispositivo serie
python src/main.py --device-type serial --wait
```

### 4. Configurar Timeout

```bash
# Esperar máximo 60 segundos
python src/main.py --timeout 60
```

## Casos de Uso Avanzados

### 5. Modo Verbose (Depuración)

```bash
python src/main.py --verbose
```

**Salida adicional:**
```
💻 Platform Information:
   system: Darwin
   release: 21.6.0
   python_version: 3.9.7
🚀 Initializing MobileBot IMEI Reader...
DEBUG: Initialized ADB method
DEBUG: Initialized AT Commands method
```

### 6. Modo Silencioso

```bash
python src/main.py --quiet
```

Solo muestra el IMEI sin información adicional.

### 7. Listar Dispositivos Detectados

```bash
python src/main.py --list-devices
```

**Salida:**
```
🔍 Scanning for devices...
📱 Found 2 device(s):
============================================================
Device 1:
  Type: android
  Connection Info:
    device_id: ABC123DEF456
    status: device
    adb_path: adb
    details: usb:1-1 product:galaxy_s21 model:SM_G991U
----------------------------------------
Device 2:
  Type: serial
  Connection Info:
    port: /dev/ttyUSB0
    description: Qualcomm HSUSB Device
    manufacturer: Qualcomm
    vid: 1234
    pid: 5678
----------------------------------------
```

### 8. Listar Métodos Disponibles

```bash
python src/main.py --list-methods
```

**Salida:**
```
🛠️  Available reading methods (2):
==================================================
Name: ADBMethod
Priority: 10
Description: IMEI reading method using Android Debug Bridge.
----------------------------------------
Name: ATCommandsMethod
Priority: 30
Description: IMEI reading method using AT commands over serial connection.
----------------------------------------
```

## Configuración Personalizada

### 9. Usar Archivo de Configuración Personalizado

```bash
python src/main.py --config mi_config.json
```

**Contenido de `mi_config.json`:**
```json
{
  "logging": {
    "level": "DEBUG",
    "file_enabled": true,
    "log_directory": "logs_personalizados"
  },
  "device_detection": {
    "timeout": 30,
    "retry_attempts": 5
  },
  "adb": {
    "command_timeout": 10,
    "alternative_commands": [
      "service call iphonesubinfo 3",
      "dumpsys iphonesubinfo",
      "getprop ro.telephony.imei"
    ]
  },
  "serial": {
    "baudrate": 9600,
    "timeout": 2,
    "at_commands": [
      "AT+CGSN",
      "AT+GSN",
      "AT*GETSERIALNUMBER"
    ]
  }
}
```

### 10. Variables de Entorno

```bash
# Configurar mediante variables de entorno
export MOBILEBOT_LOG_LEVEL=DEBUG
export MOBILEBOT_ADB_TIMEOUT=15
export MOBILEBOT_SERIAL_BAUDRATE=9600

python src/main.py
```

## Integración con Scripts

### 11. Script de Bash

```bash
#!/bin/bash
# read_imei.sh

echo "Iniciando lectura de IMEI..."

# Ejecutar MobileBot y capturar resultado
if python src/main.py --quiet > imei_result.txt 2>&1; then
    IMEI=$(grep "IMEI:" imei_result.txt | cut -d' ' -f2)
    echo "IMEI obtenido: $IMEI"
    
    # Guardar en base de datos o archivo
    echo "$(date): $IMEI" >> imei_log.txt
    
    echo "¡Éxito!"
else
    echo "Error al leer IMEI"
    cat imei_result.txt
    exit 1
fi
```

### 12. Script de Python

```python
#!/usr/bin/env python3
# automatizar_imei.py

import subprocess
import sys
import json
from datetime import datetime

def leer_imei():
    """Ejecutar MobileBot y obtener IMEI."""
    try:
        result = subprocess.run(
            [sys.executable, "src/main.py", "--quiet"],
            capture_output=True,
            text=True,
            timeout=60
        )
        
        if result.returncode == 0:
            # Procesar salida para extraer IMEI
            lines = result.stdout.strip().split('\n')
            for line in lines:
                if 'IMEI:' in line:
                    imei = line.split('IMEI:')[1].strip()
                    return imei
        else:
            print(f"Error: {result.stderr}")
            return None
            
    except subprocess.TimeoutExpired:
        print("Timeout: El proceso tardó más de 60 segundos")
        return None
    except Exception as e:
        print(f"Error inesperado: {e}")
        return None

def guardar_resultado(imei):
    """Guardar resultado en archivo JSON."""
    resultado = {
        "timestamp": datetime.now().isoformat(),
        "imei": imei,
        "status": "success" if imei else "failed"
    }
    
    with open("imei_results.json", "a") as f:
        json.dump(resultado, f)
        f.write('\n')

if __name__ == "__main__":
    print("🔍 Iniciando lectura automática de IMEI...")
    
    imei = leer_imei()
    
    if imei:
        print(f"✅ IMEI obtenido: {imei}")
        guardar_resultado(imei)
    else:
        print("❌ No se pudo obtener el IMEI")
        guardar_resultado(None)
        sys.exit(1)
```

## Casos de Uso Específicos

### 13. Monitoreo Continuo

```bash
#!/bin/bash
# monitor_devices.sh

while true; do
    echo "$(date): Verificando dispositivos..."
    
    if python src/main.py --list-devices | grep -q "Found.*device"; then
        echo "Dispositivo detectado, leyendo IMEI..."
        python src/main.py --timeout 30
    else
        echo "No hay dispositivos conectados"
    fi
    
    sleep 10
done
```

### 14. Múltiples Intentos

```bash
#!/bin/bash
# retry_imei.sh

MAX_ATTEMPTS=5
ATTEMPT=1

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    echo "Intento $ATTEMPT de $MAX_ATTEMPTS..."
    
    if python src/main.py --timeout 20; then
        echo "¡Éxito en intento $ATTEMPT!"
        exit 0
    else
        echo "Intento $ATTEMPT falló"
        ATTEMPT=$((ATTEMPT + 1))
        sleep 5
    fi
done

echo "Todos los intentos fallaron"
exit 1
```

### 15. Validación de IMEI

```python
#!/usr/bin/env python3
# validar_imei.py

import subprocess
import sys
import re

def validar_imei(imei):
    """Validar formato y checksum de IMEI."""
    if not imei or len(imei) != 15:
        return False
    
    if not imei.isdigit():
        return False
    
    # Algoritmo de Luhn
    total = 0
    for i, digit in enumerate(reversed(imei)):
        n = int(digit)
        if i % 2 == 1:
            n *= 2
            if n > 9:
                n = n // 10 + n % 10
        total += n
    
    return total % 10 == 0

def main():
    # Leer IMEI
    result = subprocess.run(
        [sys.executable, "src/main.py", "--quiet"],
        capture_output=True,
        text=True
    )
    
    if result.returncode != 0:
        print("❌ Error al leer IMEI")
        return 1
    
    # Extraer IMEI de la salida
    imei_match = re.search(r'IMEI:\s*(\d{15})', result.stdout)
    if not imei_match:
        print("❌ No se pudo extraer IMEI de la salida")
        return 1
    
    imei = imei_match.group(1)
    
    # Validar
    if validar_imei(imei):
        print(f"✅ IMEI válido: {imei}")
        return 0
    else:
        print(f"❌ IMEI inválido: {imei}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
```

## Resolución de Problemas por Caso de Uso

### Dispositivo No Detectado
```bash
# Verificar dispositivos disponibles
python src/main.py --list-devices --verbose

# Probar con diferentes timeouts
python src/main.py --timeout 60 --verbose

# Verificar ADB manualmente
adb devices
```

### IMEI No Leído
```bash
# Probar diferentes métodos
python src/main.py --verbose  # Mostrará qué métodos fallan

# Verificar permisos de ADB
adb shell echo "test"

# Para dispositivos serie, verificar puertos
python -c "import serial.tools.list_ports; print([p.device for p in serial.tools.list_ports.comports()])"
```

### Performance Lenta
```bash
# Reducir timeout
python src/main.py --timeout 10

# Usar configuración optimizada
python src/main.py --config config_fast.json
```

**`config_fast.json`:**
```json
{
  "device_detection": {
    "scan_interval": 1,
    "timeout": 5
  },
  "adb": {
    "command_timeout": 3
  },
  "serial": {
    "timeout": 0.5
  }
}
```
