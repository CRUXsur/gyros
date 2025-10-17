import { Cliente } from "../../clientes/entities/cliente.entity";
export declare class BancoCliente {
    id_banco_cliente: string;
    cliente: Cliente;
    banco: string;
    noCta: string;
    nombre: string;
    moneda: string;
    usuario: string;
    key: string;
    isActive: boolean;
    created_at: Date;
    updated_at: Date;
}
