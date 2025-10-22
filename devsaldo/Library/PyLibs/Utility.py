import random
import string
import subprocess
import re
from datetime import datetime


def get_random_string(length, prefix=None):
    letters = string.ascii_lowercase
    result_str = ''.join(random.choice(letters) for i in range(int(length)))
    if prefix:
        return prefix + "_" + result_str
    return result_str


def get_current_time_stamp():
    now = datetime.now()
    timestamp = datetime.timestamp(now)
    return timestamp


def get_connected_device_id():
    """
    Obtiene el device_id del primer dispositivo Android conectado via USB usando ADB.
    
    Returns:
        str: Device ID del dispositivo conectado
        
    Raises:
        Exception: Si no se encuentra ningún dispositivo conectado o si hay error en ADB
    """
    print("\n" + "="*60)
    print("🔍 INICIANDO DETECCIÓN DE DISPOSITIVOS USB")
    print("="*60)
    
    try:
        # Ejecutar comando adb devices para obtener lista de dispositivos conectados
        print("📱 Ejecutando comando: adb devices")
        result = subprocess.run(['adb', 'devices'], capture_output=True, text=True, timeout=10)
        
        print(f"📤 Salida del comando ADB:")
        print(f"   Return code: {result.returncode}")
        print(f"   Stdout: {repr(result.stdout)}")
        if result.stderr:
            print(f"   Stderr: {repr(result.stderr)}")
        
        if result.returncode != 0:
            raise Exception(f"Error ejecutando ADB: {result.stderr}")
        
        # Parsear la salida para obtener device IDs
        lines = result.stdout.strip().split('\n')
        print(f"📋 Analizando {len(lines)} líneas de salida:")
        
        for i, line in enumerate(lines):
            print(f"   Línea {i}: '{line}'")
        
        # Buscar líneas que contengan dispositivos (formato: "DEVICE_ID    device")
        connected_devices = []
        print("\n🔎 Buscando dispositivos conectados:")
        
        for i, line in enumerate(lines[1:], 1):  # Saltar la primera línea "List of devices attached"
            print(f"   Procesando línea {i}: '{line.strip()}'")
            
            if line.strip() and 'device' in line and 'offline' not in line:
                # Extraer el device ID (primera parte antes del tab/espacios)
                device_id = re.split(r'\s+', line.strip())[0]
                if device_id:
                    connected_devices.append(device_id)
                    print(f"   ✅ Dispositivo encontrado: '{device_id}'")
            else:
                print(f"   ❌ Línea descartada (no es dispositivo válido)")
        
        print(f"\n📊 RESUMEN DE DETECCIÓN:")
        print(f"   Total dispositivos encontrados: {len(connected_devices)}")
        
        if connected_devices:
            for i, device in enumerate(connected_devices):
                print(f"   Dispositivo {i+1}: {device}")
        
        if not connected_devices:
            print("❌ ERROR: No se encontraron dispositivos conectados")
            raise Exception("No se encontró ningún dispositivo Android conectado. Verificar conexión USB y debugging habilitado.")
        
        # Retornar el primer dispositivo encontrado
        device_id = connected_devices[0]
        print(f"\n🎯 DISPOSITIVO SELECCIONADO: {device_id}")
        print("="*60)
        
        return device_id
        
    except subprocess.TimeoutExpired:
        print("❌ TIMEOUT: Comando ADB tardó más de 10 segundos")
        raise Exception("Timeout ejecutando comando ADB. Verificar que ADB esté instalado y disponible.")
    except FileNotFoundError:
        print("❌ ERROR: Comando 'adb' no encontrado")
        raise Exception("ADB no encontrado. Verificar que Android SDK esté instalado y ADB en PATH.")
    except Exception as e:
        print(f"❌ ERROR GENERAL: {str(e)}")
        raise Exception(f"Error obteniendo device ID: {str(e)}")


def validate_device_connection(device_id):
    """
    Valida que el dispositivo especificado esté conectado y accesible.
    
    Args:
        device_id (str): ID del dispositivo a validar
        
    Returns:
        bool: True si el dispositivo está conectado y accesible
        
    Raises:
        Exception: Si el dispositivo no está disponible
    """
    print(f"\n🔍 VALIDANDO CONEXIÓN DEL DISPOSITIVO: {device_id}")
    print("-" * 50)
    
    try:
        # Verificar que el dispositivo específico responda
        print(f"📱 Ejecutando comando: adb -s {device_id} get-state")
        result = subprocess.run(['adb', '-s', device_id, 'get-state'], 
                              capture_output=True, text=True, timeout=5)
        
        print(f"📤 Resultado del comando:")
        print(f"   Return code: {result.returncode}")
        print(f"   Estado reportado: '{result.stdout.strip()}'")
        if result.stderr:
            print(f"   Stderr: '{result.stderr.strip()}'")
        
        if result.returncode == 0 and result.stdout.strip() == 'device':
            print(f"✅ VALIDACIÓN EXITOSA")
            print(f"   Dispositivo {device_id} está en estado 'device' y listo para usar")
            print("-" * 50)
            return True
        else:
            print(f"❌ VALIDACIÓN FALLIDA")
            print(f"   Estado esperado: 'device'")
            print(f"   Estado actual: '{result.stdout.strip()}'")
            raise Exception(f"Dispositivo {device_id} no está en estado 'device'. Estado actual: {result.stdout.strip()}")
            
    except subprocess.TimeoutExpired:
        print(f"❌ TIMEOUT: Validación tardó más de 5 segundos")
        raise Exception(f"Timeout validando dispositivo {device_id}")
    except Exception as e:
        print(f"❌ ERROR EN VALIDACIÓN: {str(e)}")
        raise Exception(f"Error validando dispositivo {device_id}: {str(e)}")


def get_device_info(device_id):
    """
    Obtiene información detallada del dispositivo especificado.
    
    Args:
        device_id (str): ID del dispositivo
        
    Returns:
        dict: Información del dispositivo (modelo, versión Android, etc.)
    """
    print(f"\n📋 OBTENIENDO INFORMACIÓN DETALLADA DEL DISPOSITIVO: {device_id}")
    print("=" * 60)
    
    try:
        device_info = {
            'device_id': device_id,
            'model': 'Unknown',
            'android_version': 'Unknown',
            'brand': 'Unknown',
            'manufacturer': 'Unknown',
            'api_level': 'Unknown'
        }
        
        # Lista de propiedades a obtener
        properties = [
            ('model', 'ro.product.model', 'Modelo'),
            ('android_version', 'ro.build.version.release', 'Versión Android'),
            ('brand', 'ro.product.brand', 'Marca'),
            ('manufacturer', 'ro.product.manufacturer', 'Fabricante'),
            ('api_level', 'ro.build.version.sdk', 'API Level')
        ]
        
        print("🔍 Consultando propiedades del dispositivo:")
        
        for key, prop, description in properties:
            try:
                print(f"\n   📱 Obteniendo {description} (getprop {prop})...")
                result = subprocess.run(['adb', '-s', device_id, 'shell', 'getprop', prop], 
                                      capture_output=True, text=True, timeout=5)
                
                print(f"      Return code: {result.returncode}")
                print(f"      Salida raw: '{repr(result.stdout)}'")
                
                if result.returncode == 0 and result.stdout.strip():
                    device_info[key] = result.stdout.strip()
                    print(f"      ✅ {description}: {device_info[key]}")
                else:
                    print(f"      ❌ No se pudo obtener {description}")
                    if result.stderr:
                        print(f"      Error: {result.stderr.strip()}")
                        
            except subprocess.TimeoutExpired:
                print(f"      ❌ Timeout obteniendo {description}")
            except Exception as e:
                print(f"      ❌ Error obteniendo {description}: {str(e)}")
        
        print(f"\n📊 RESUMEN COMPLETO DEL DISPOSITIVO:")
        print("=" * 60)
        print(f"🔹 Device ID:      {device_info['device_id']}")
        print(f"🔹 Marca:          {device_info['brand']}")
        print(f"🔹 Fabricante:     {device_info['manufacturer']}")
        print(f"🔹 Modelo:         {device_info['model']}")
        print(f"🔹 Android:        {device_info['android_version']}")
        print(f"🔹 API Level:      {device_info['api_level']}")
        print("=" * 60)
        
        return device_info
        
    except Exception as e:
        print(f"❌ ERROR GENERAL obteniendo información del dispositivo: {str(e)}")
        error_info = {
            'device_id': device_id, 
            'model': 'Error', 
            'android_version': 'Error', 
            'brand': 'Error',
            'manufacturer': 'Error',
            'api_level': 'Error'
        }
        print("⚠️  Retornando información de error")
        return error_info

