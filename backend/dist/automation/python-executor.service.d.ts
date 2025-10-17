export declare class PythonExecutorService {
    private readonly logger;
    private readonly robotPath;
    executeDeviceDetection(): Promise<string>;
    checkDeviceConnection(deviceId: string): Promise<boolean>;
    executeRobotAction(deviceId: string): Promise<any>;
    executeAutomationInterface(actionType: string): Promise<any>;
    executeCustomPythonScript(scriptPath: string, args?: string[]): Promise<any>;
}
