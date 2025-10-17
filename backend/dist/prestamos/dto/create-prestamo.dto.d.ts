export declare class CreatePrestamoDto {
    id_cliente: string;
    monto_prestado?: number;
    tasa_interes?: number;
    plazo_meses?: number;
    fecha_prestamo?: Date;
    fecha_vencimiento?: Date;
    isActive?: boolean;
    images?: string[];
}
