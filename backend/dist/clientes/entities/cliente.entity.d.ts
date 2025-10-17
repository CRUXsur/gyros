import { BancoCliente } from "../../banco-cliente/entities/banco-cliente.entity";
export declare class Cliente {
    id_cliente: string;
    nombrecompleto: string;
    ci: string;
    celular: string;
    fijo: string;
    isActive: boolean;
    device_id: string;
    fecha_vto_tarjeta: Date;
    sector: string;
    codigo: string;
    banco: string;
    numero_cuenta: string;
    moneda: string;
    garante: string;
    celular_garante: string;
    observaciones: string;
    fecha_registro: Date;
    bancos: BancoCliente[];
    checkFieldsBeforeInsert(): void;
    checkFieldsBeforeUpdate(): void;
}
