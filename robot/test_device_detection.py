#!/usr/bin/env python3
"""
Script para detectar el device_id de un dispositivo Android conectado via USB.
Este script es llamado por el backend NestJS para obtener el device_id.
"""

import sys
import os

# Agregar el directorio PyLibs al path para poder importar Utility
script_dir = os.path.dirname(os.path.abspath(__file__))
pylibs_path = os.path.join(script_dir, 'Library', 'PyLibs')
sys.path.insert(0, pylibs_path)

try:
    from Utility import get_connected_device_id
    
    # Obtener el device_id del dispositivo conectado
    device_id = get_connected_device_id()
    
    # Imprimir en el formato esperado por el backend
    print(f"Device ID: {device_id}")
    
    # Salir con código 0 (éxito)
    sys.exit(0)
    
except Exception as e:
    print(f"Error: {str(e)}", file=sys.stderr)
    sys.exit(1)

