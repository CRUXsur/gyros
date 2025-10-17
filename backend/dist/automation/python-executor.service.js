"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PythonExecutorService = void 0;
const common_1 = require("@nestjs/common");
const child_process_1 = require("child_process");
const path = require("path");
let PythonExecutorService = class PythonExecutorService {
    logger = new common_1.Logger('PythonExecutorService');
    robotPath = path.join(process.cwd(), '..', 'robot');
    async executeDeviceDetection() {
        this.logger.log('Ejecutando detección de dispositivo USB...');
        return new Promise((resolve, reject) => {
            const pythonProcess = (0, child_process_1.spawn)('python3', [
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
                    const deviceIdMatch = outputData.match(/Device ID:\s*([^\s\n]+)/);
                    if (deviceIdMatch && deviceIdMatch[1]) {
                        const deviceId = deviceIdMatch[1].trim();
                        this.logger.log(`Device ID detectado: ${deviceId}`);
                        resolve(deviceId);
                    }
                    else {
                        this.logger.error('No se pudo extraer device_id de la salida Python');
                        reject(new Error('No se detectó device_id válido'));
                    }
                }
                else {
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
    async checkDeviceConnection(deviceId) {
        this.logger.log(`Validando conexión del dispositivo: ${deviceId}`);
        return new Promise((resolve, reject) => {
            const pythonProcess = (0, child_process_1.spawn)('python3', [
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
                }
                else {
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
    async executeRobotAction(deviceId) {
        this.logger.log(`Ejecutando acción Robot Framework para device: ${deviceId}`);
        return new Promise((resolve, reject) => {
            const pythonProcess = (0, child_process_1.spawn)('python3', [
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
                }
                else {
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
    async executeAutomationInterface(actionType) {
        this.logger.log(`Ejecutando automation interface con acción: ${actionType}`);
        return new Promise((resolve, reject) => {
            const scriptPath = path.join(this.robotPath, 'automation_interface.py');
            const pythonProcess = (0, child_process_1.spawn)('python3', [scriptPath, actionType]);
            let outputData = '';
            let errorData = '';
            pythonProcess.stdout.on('data', (data) => {
                outputData += data.toString();
            });
            pythonProcess.stderr.on('data', (data) => {
                errorData += data.toString();
            });
            pythonProcess.on('close', (code) => {
                try {
                    const jsonMatch = outputData.match(/📊 RESULTADO FINAL:\s*(\{[\s\S]*?\})\s*={60}/);
                    if (jsonMatch && jsonMatch[1]) {
                        const result = JSON.parse(jsonMatch[1]);
                        this.logger.log(`Automation Interface completado: ${actionType}`);
                        resolve(result);
                    }
                    else if (code === 0) {
                        resolve({
                            success: true,
                            actionType,
                            output: outputData,
                            timestamp: new Date(),
                        });
                    }
                    else {
                        this.logger.error(`Automation Interface falló con código: ${code}`);
                        reject(new Error(`Proceso falló: ${errorData || 'Código de salida ' + code}`));
                    }
                }
                catch (parseError) {
                    this.logger.error('Error parseando resultado JSON:', parseError);
                    reject(new Error(`Error parseando resultado: ${parseError.message}`));
                }
            });
            pythonProcess.on('error', (error) => {
                this.logger.error('Error ejecutando automation interface:', error);
                reject(error);
            });
        });
    }
    async executeCustomPythonScript(scriptPath, args = []) {
        this.logger.log(`Ejecutando script personalizado: ${scriptPath}`);
        return new Promise((resolve, reject) => {
            const fullPath = path.join(this.robotPath, scriptPath);
            const pythonProcess = (0, child_process_1.spawn)('python3', [fullPath, ...args]);
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
                }
                else {
                    reject(new Error(`Script falló: ${errorData || 'Código de salida ' + code}`));
                }
            });
            pythonProcess.on('error', (error) => {
                this.logger.error('Error ejecutando script personalizado:', error);
                reject(error);
            });
        });
    }
};
exports.PythonExecutorService = PythonExecutorService;
exports.PythonExecutorService = PythonExecutorService = __decorate([
    (0, common_1.Injectable)()
], PythonExecutorService);
//# sourceMappingURL=python-executor.service.js.map