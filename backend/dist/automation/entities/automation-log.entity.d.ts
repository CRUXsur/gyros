import { Cliente } from '../../clientes/entities/cliente.entity';
import { User } from '../../auth/entities/user.entity';
export declare class AutomationLog {
    id: string;
    deviceId: string;
    action: string;
    result: any;
    timestamp: Date;
    success: boolean;
    notes?: string;
    cliente?: Cliente;
    user?: User;
}
