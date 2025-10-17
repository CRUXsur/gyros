import { Prestamo } from "../../prestamos/entities/prestamo.entity";
import { User } from "../../auth/entities/user.entity";
export declare class Cuota {
    id_cuota: string;
    prestamo: Prestamo;
    numero_cuota: number;
    monto_cuota: number;
    monto_pagado: number;
    fecha_vencimiento: Date;
    fecha_pago?: Date;
    estado: string;
    observaciones?: string;
    isActive: boolean;
    user: User;
}
