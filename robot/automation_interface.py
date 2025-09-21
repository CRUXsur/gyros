#!/usr/bin/env python3
"""
Script de interfaz principal entre NestJS y Robot Framework.
Este módulo actúa como puente de comunicación para automatización.

Autor: Sistema Gyros
Fecha: Septiembre 2025
"""

import sys
import os
import json
from datetime import datetime
from typing import Dict, Any, Optional

# Agregar el directorio de bibliotecas al path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'Library', 'PyLibs'))

try:
    from Utility import get_connected_device_id, validate_device_connection, get_device_info
except ImportError as e:
    print(f"Error importando módulos: {e}")
    sys.exit(1)


class AutomationInterface:
    """
    Clase principal para manejar la automatización entre NestJS y Robot Framework.
    """
    
    def __init__(self):
        self.device_id = None
        self.last_detection_time = None
        
    def check_device_and_execute(self, action_type: str = "check_device") -> Dict[str, Any]:
        """
        Función principal que ejecuta desde NestJS.
        
        Args:
            action_type (str): Tipo de acción a ejecutar
            
        Returns:
            dict: Resultado de la operación
        """
        try:
            print(f"\n🔧 AUTOMATION INTERFACE - Iniciando acción: {action_type}")
            print("=" * 60)
            
            # 1. Detectar dispositivo
            device_id = get_connected_device_id()
            self.device_id = device_id
            self.last_detection_time = datetime.now()
            
            print(f"📱 Device ID detectado: {device_id}")
            
            # 2. Validar conexión
            validate_device_connection(device_id)
            print(f"✅ Dispositivo validado correctamente")
            
            # 3. Ejecutar acción según el tipo
            if action_type == "check_device":
                result = self._check_device_only(device_id)
                
            elif action_type == "make_action":
                result = self._make_action(device_id)
                
            elif action_type == "get_device_info":
                result = self._get_detailed_info(device_id)
                
            elif action_type == "toggle_prestamo_status":
                # Esta acción se manejará desde NestJS directamente
                result = {
                    "device_id": device_id,
                    "action": "toggle_prestamo_status",
                    "message": "Esta acción se maneja desde NestJS",
                    "status": "delegated_to_nestjs"
                }
                
            else:
                raise ValueError(f"Acción no válida: {action_type}")
            
            print(f"🎯 Acción '{action_type}' completada exitosamente")
            return result
            
        except Exception as e:
            error_result = {
                "success": False,
                "error": str(e),
                "action": action_type,
                "timestamp": datetime.now().isoformat(),
                "device_id": getattr(self, 'device_id', None)
            }
            print(f"❌ Error en automation interface: {e}")
            return error_result
    
    def _check_device_only(self, device_id: str) -> Dict[str, Any]:
        """
        Solo verificar dispositivo sin acciones adicionales.
        
        Args:
            device_id (str): ID del dispositivo
            
        Returns:
            dict: Información básica del dispositivo
        """
        return {
            "success": True,
            "device_id": device_id,
            "action": "check_device",
            "status": "detected",
            "timestamp": datetime.now().isoformat(),
            "message": "Dispositivo detectado y validado exitosamente"
        }
    
    def _make_action(self, device_id: str) -> Dict[str, Any]:
        """
        Ejecutar acción principal que modifica el estado del préstamo.
        Esta función será llamada cuando se detecte un cliente con préstamos activos.
        
        Args:
            device_id (str): ID del dispositivo
            
        Returns:
            dict: Resultado de la acción
        """
        print(f"🔄 Ejecutando make_action para device: {device_id}")
        
        # Obtener información del dispositivo
        device_info = get_device_info(device_id)
        
        # Simular acción de robot (por ejemplo, abrir una app específica)
        robot_action_result = self._simulate_robot_action(device_id)
        
        return {
            "success": True,
            "device_id": device_id,
            "action": "make_action",
            "device_info": device_info,
            "robot_action": robot_action_result,
            "timestamp": datetime.now().isoformat(),
            "message": "Acción de automatización ejecutada exitosamente",
            "next_steps": "NestJS debe actualizar isActive en tabla prestamos"
        }
    
    def _get_detailed_info(self, device_id: str) -> Dict[str, Any]:
        """
        Obtener información detallada del dispositivo.
        
        Args:
            device_id (str): ID del dispositivo
            
        Returns:
            dict: Información detallada
        """
        device_info = get_device_info(device_id)
        
        return {
            "success": True,
            "device_id": device_id,
            "action": "get_device_info",
            "device_info": device_info,
            "detection_time": self.last_detection_time.isoformat() if self.last_detection_time else None,
            "timestamp": datetime.now().isoformat()
        }
    
    def _simulate_robot_action(self, device_id: str) -> Dict[str, Any]:
        """
        Simular una acción de Robot Framework.
        En una implementación real, aquí se ejecutarían comandos específicos del robot.
        
        Args:
            device_id (str): ID del dispositivo
            
        Returns:
            dict: Resultado de la acción del robot
        """
        print(f"🤖 Ejecutando acción de Robot Framework para device: {device_id}")
        
        # Aquí podríamos ejecutar comandos específicos como:
        # - Abrir una aplicación específica
        # - Tomar una screenshot
        # - Interactuar con la UI
        # - Verificar estado de la aplicación
        
        return {
            "action_type": "robot_simulation",
            "steps_executed": [
                "Conectar con dispositivo",
                "Validar estado de la aplicación",
                "Ejecutar comandos específicos",
                "Verificar resultado"
            ],
            "duration_seconds": 2.5,
            "success": True,
            "message": "Acción de robot ejecutada exitosamente"
        }


def main():
    """
    Función principal para uso desde línea de comandos.
    """
    if len(sys.argv) < 2:
        print("Uso: python automation_interface.py <action_type>")
        print("Acciones disponibles: check_device, make_action, get_device_info")
        sys.exit(1)
    
    action_type = sys.argv[1]
    
    interface = AutomationInterface()
    result = interface.check_device_and_execute(action_type)
    
    # Imprimir resultado en formato JSON para NestJS
    print("\n" + "="*60)
    print("📊 RESULTADO FINAL:")
    print(json.dumps(result, indent=2, ensure_ascii=False))
    print("="*60)
    
    # Exit code basado en el éxito
    sys.exit(0 if result.get('success', False) else 1)


if __name__ == "__main__":
    main()
