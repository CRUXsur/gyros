#!/usr/bin/env python3
"""
Script de prueba independiente para verificar la detección de dispositivos USB.
Se puede ejecutar directamente desde la línea de comandos.

Uso: python test_device_detection.py
"""

import sys
import os

# Agregar el directorio de bibliotecas al path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'Library', 'PyLibs'))

from Utility import get_connected_device_id, validate_device_connection, get_device_info

def main():
    print("=" * 70)
    print("🔬 PRUEBA DETALLADA DE DETECCIÓN DE DISPOSITIVOS USB")
    print("=" * 70)
    
    try:
        print("\n🔍 PASO 1: Detectando dispositivos conectados...")
        print("-" * 50)
        device_id = get_connected_device_id()
        print(f"\n✅ RESULTADO PASO 1: Dispositivo detectado exitosamente")
        print(f"   📱 Device ID: {device_id}")
        
        print("\n🔍 PASO 2: Validando conexión del dispositivo...")
        print("-" * 50)
        validate_device_connection(device_id)
        print(f"\n✅ RESULTADO PASO 2: Dispositivo validado correctamente")
        
        print("\n🔍 PASO 3: Obteniendo información detallada del dispositivo...")
        print("-" * 50)
        device_info = get_device_info(device_id)
        print(f"\n✅ RESULTADO PASO 3: Información obtenida exitosamente")
        
        print("\n📋 PASO 4: Resumen final del dispositivo detectado:")
        print("=" * 70)
        print(f"🔹 Device ID:        {device_info['device_id']}")
        print(f"🔹 Marca:            {device_info['brand']}")
        print(f"🔹 Fabricante:       {device_info['manufacturer']}")
        print(f"🔹 Modelo:           {device_info['model']}")
        print(f"🔹 Versión Android:  {device_info['android_version']}")
        print(f"🔹 API Level:        {device_info['api_level']}")
        print("=" * 70)
        
        print("\n🎉 PRUEBA COMPLETADA EXITOSAMENTE")
        print("✅ El dispositivo está listo para ejecutar tests de Robot Framework")
        print("✅ Todas las funciones de detección trabajan correctamente")
        print("=" * 70)
        
        return True
        
    except Exception as e:
        print(f"\n❌ ERROR CRÍTICO: {str(e)}")
        print("\n🔧 POSIBLES SOLUCIONES:")
        print("   1. Verificar que el dispositivo esté conectado por USB")
        print("   2. Habilitar 'Depuración USB' en opciones de desarrollador")
        print("   3. Verificar que ADB esté instalado y disponible en PATH")
        print("   4. Ejecutar 'adb devices' manualmente para diagnóstico")
        print("   5. Reiniciar ADB server: 'adb kill-server && adb start-server'")
        print("\n" + "=" * 70)
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
