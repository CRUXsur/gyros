export declare class Cliente {
    id: string;
    nombres: string;
    ci: string;
    telefono: string;
    device_id: string;
    email: string;
    sexo: string[];
    estado_civil: string[];
    isActive: boolean;
    checkFieldsBeforeInsert(): void;
    checkFieldsBeforeUpdate(): void;
}
