import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import * as path from 'path';

@Injectable()
export class PythonExecutorService {
  private readonly logger = new Logger('PythonExecutorService');
  private readonly robotPath = path.join(process.cwd(), '..', 'robot');

  async executeDeviceDetection(): Promise<string> {
    this.logger.log('Ejecutando detección de dispositivo USB...');
    
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python3', [
        path.join(this.robotPath, 'test_device_detection.py')
      ]);

      let outputData = '';
      let errorData = '';

      pythonProcess.stdout.on('data', (data) => {
        outputData += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code === 0) {
          // Parsear salida para extraer device_id
          const deviceIdMatch = outputData.match(/Device ID:\s*([^\s\n]+)/);
          
          if (deviceIdMatch && deviceIdMatch[1]) {
            const deviceId = deviceIdMatch[1].trim();
            this.logger.log(`Device ID detectado: ${deviceId}`);
            resolve(deviceId);
          } else {
            this.logger.error('No se pudo extraer device_id de la salida Python');
            reject(new Error('No se detectó device_id válido'));
          }
        } else {
          this.logger.error(`Proceso Python falló con código: ${code}`);
          this.logger.error(`Error: ${errorData}`);
          reject(new Error(`Error ejecutando detección: ${errorData || 'Proceso falló'}`));
        }
      });

      pythonProcess.on('error', (error) => {
        this.logger.error('Error iniciando proceso Python:', error);
        reject(new Error(`Error iniciando Python: ${error.message}`));
      });
    });
  }

  async checkDeviceConnection(deviceId: string): Promise<boolean> {
    this.logger.log(`Validando conexión del dispositivo: ${deviceId}`);
    
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python3', [
        '-c', 
        `
import sys
sys.path.insert(0, '${this.robotPath}/Library/PyLibs')
from Utility import validate_device_connection
try:
    validate_device_connection('${deviceId}')
    print('VALID')
except Exception as e:
    print(f'INVALID: {e}')
        `
      ]);

      let outputData = '';
      let errorData = '';

      pythonProcess.stdout.on('data', (data) => {
        outputData += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
      });

      pythonProcess.on('close', (code) => {
        const isValid = outputData.includes('VALID') && !outputData.includes('INVALID');
        
        if (isValid) {
          this.logger.log(`Dispositivo ${deviceId} es válido`);
          resolve(true);
        } else {
          this.logger.warn(`Dispositivo ${deviceId} no es válido: ${outputData}`);
          resolve(false);
        }
      });

      pythonProcess.on('error', (error) => {
        this.logger.error('Error validando dispositivo:', error);
        reject(error);
      });
    });
  }

  async executeRobotAction(deviceId: string): Promise<any> {
    this.logger.log(`Ejecutando acción Robot Framework para device: ${deviceId}`);
    
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python3', [
        '-c',
        `
import sys
sys.path.insert(0, '${this.robotPath}/Library/PyLibs')
from Utility import get_device_info
try:
    result = get_device_info('${deviceId}')
    print('SUCCESS:', result)
except Exception as e:
    print('ERROR:', str(e))
        `
      ]);

      let outputData = '';
      let errorData = '';

      pythonProcess.stdout.on('data', (data) => {
        outputData += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (outputData.includes('SUCCESS:')) {
          const resultMatch = outputData.match(/SUCCESS:\s*(.+)/);
          const result = resultMatch ? resultMatch[1] : 'Acción completada';
          
          this.logger.log(`Acción Robot completada: ${result}`);
          resolve({
            success: true,
            deviceId,
            result,
            timestamp: new Date(),
          });
        } else {
          const errorMatch = outputData.match(/ERROR:\s*(.+)/);
          const error = errorMatch ? errorMatch[1] : 'Error desconocido';
          
          this.logger.error(`Error en acción Robot: ${error}`);
          reject(new Error(error));
        }
      });

      pythonProcess.on('error', (error) => {
        this.logger.error('Error ejecutando Robot action:', error);
        reject(error);
      });
    });
  }

  async executeCustomPythonScript(scriptPath: string, args: string[] = []): Promise<any> {
    this.logger.log(`Ejecutando script personalizado: ${scriptPath}`);
    
    return new Promise((resolve, reject) => {
      const fullPath = path.join(this.robotPath, scriptPath);
      const pythonProcess = spawn('python3', [fullPath, ...args]);

      let outputData = '';
      let errorData = '';

      pythonProcess.stdout.on('data', (data) => {
        outputData += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code === 0) {
          resolve({
            success: true,
            output: outputData,
            timestamp: new Date(),
          });
        } else {
          reject(new Error(`Script falló: ${errorData || 'Código de salida ' + code}`));
        }
      });

      pythonProcess.on('error', (error) => {
        this.logger.error('Error ejecutando script personalizado:', error);
        reject(error);
      });
    });
  }
}