import subprocess
import socket
import sys
from time import sleep
import requests
import shutil


class AppiumManager:
    appium_process = None

    @staticmethod
    def is_port_available(port):
        """Verifica si un puerto está disponible"""
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        try:
            sock.bind(('localhost', int(port)))
            sock.close()
            return True
        except OSError:
            return False

    @staticmethod
    def is_appium_installed():
        """Verifica si Appium está instalado"""
        return shutil.which("appium") is not None

    @staticmethod
    def wait_for_appium_ready(port, timeout=30):
        """Espera a que el servidor Appium esté listo para aceptar conexiones"""
        url = f"http://localhost:{port}/status"
        print(f"⏳ Esperando que Appium esté listo en puerto {port}...")
        
        for i in range(timeout):
            try:
                response = requests.get(url, timeout=2)
                if response.status_code == 200:
                    print(f"✅ Servidor Appium listo en puerto {port}")
                    return True
            except requests.exceptions.RequestException:
                pass
            
            if i % 5 == 0 and i > 0:
                print(f"   Esperando... ({i}/{timeout}s)")
            sleep(1)
        
        return False

    @staticmethod
    def start_appium_server(port):
        """Inicia el servidor Appium con validación completa"""
        print("=" * 60)
        print(f"🚀 INICIANDO SERVIDOR APPIUM")
        print("=" * 60)
        
        # Verificar que Appium está instalado
        if not AppiumManager.is_appium_installed():
            error_msg = """
❌ ERROR: Appium no está instalado o no está en el PATH
            
Por favor, instala Appium con:
    npm install -g appium
    appium driver install uiautomator2
"""
            print(error_msg)
            raise RuntimeError("Appium no está instalado")
        
        print("✓ Appium está instalado")
        
        # Verificar si el puerto está disponible
        if not AppiumManager.is_port_available(port):
            print(f"⚠️  Puerto {port} ya está en uso")
            print(f"🔍 Verificando si ya hay un servidor Appium corriendo...")
            
            if AppiumManager.wait_for_appium_ready(port, timeout=5):
                print(f"✅ Servidor Appium ya está corriendo en puerto {port}")
                print("=" * 60)
                return
            else:
                error_msg = f"""
❌ ERROR: Puerto {port} está ocupado pero no responde como servidor Appium

Soluciones:
1. Libera el puerto: lsof -ti:{port} | xargs kill -9
2. Usa otro puerto modificando la variable APPIUM-PORT en Base.robot
"""
                print(error_msg)
                raise RuntimeError(f"Puerto {port} ocupado")
        
        print(f"✓ Puerto {port} disponible")
        
        # Iniciar el servidor Appium
        try:
            print(f"📡 Iniciando servidor Appium en puerto {port}...")
            
            # Crear archivo de log
            log_file = open('/tmp/appium.log', 'w')
            
            AppiumManager.appium_process = subprocess.Popen(
                ["appium", "-p", str(port)],
                stdout=log_file,
                stderr=subprocess.STDOUT,
                preexec_fn=None if sys.platform == 'win32' else lambda: None
            )
            
            # Esperar a que el servidor esté listo
            if AppiumManager.wait_for_appium_ready(port, timeout=30):
                print("✅ Servidor Appium iniciado exitosamente")
                print(f"📋 Logs disponibles en: /tmp/appium.log")
                print("=" * 60)
            else:
                # Si no se pudo conectar, terminar el proceso
                if AppiumManager.appium_process:
                    AppiumManager.appium_process.terminate()
                    AppiumManager.appium_process = None
                
                error_msg = """
❌ ERROR: Appium no respondió en el tiempo esperado

Verifica los logs en: /tmp/appium.log
O inicia Appium manualmente en otra terminal: appium -p 4723
"""
                print(error_msg)
                raise RuntimeError("Appium no pudo iniciarse correctamente")
                
        except FileNotFoundError:
            error_msg = """
❌ ERROR: No se pudo ejecutar el comando 'appium'

Asegúrate de que Appium esté instalado:
    npm install -g appium
    appium driver install uiautomator2
"""
            print(error_msg)
            raise
        except Exception as e:
            print(f"❌ Error inesperado al iniciar Appium: {e}")
            raise

    @staticmethod
    def kill_appium_server():
        """Detiene el servidor Appium de forma segura"""
        print("=" * 60)
        print("🛑 Deteniendo servidor Appium...")
        
        if AppiumManager.appium_process:
            try:
                AppiumManager.appium_process.terminate()
                
                # Esperar a que termine
                try:
                    AppiumManager.appium_process.wait(timeout=5)
                    print("✅ Servidor Appium detenido correctamente")
                except subprocess.TimeoutExpired:
                    print("⚠️  Forzando cierre del servidor Appium...")
                    AppiumManager.appium_process.kill()
                    AppiumManager.appium_process.wait()
                    print("✅ Servidor Appium forzado a cerrar")
                    
                AppiumManager.appium_process = None
                
            except Exception as e:
                print(f"⚠️  Error al detener Appium: {e}")
        else:
            print("ℹ️  No hay proceso de Appium para detener")
        
        print("=" * 60)
        sleep(2)