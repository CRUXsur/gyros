export declare class CreateCuotaDto {
    id_prestamo: string;
    numero_cuota: number;
    monto_cuota: number;
    monto_pagado?: number;
    fecha_vencimiento: Date;
    fecha_pago?: Date;
    estado?: string;
    observaciones?: string;
    isActive?: boolean;
}
