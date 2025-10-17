export declare class CreatePagoDto {
    id_cuota: string;
    id_prestamo: string;
    monto_pago: number;
    fecha_pago: Date;
    metodo_pago?: string;
    numero_comprobante?: string;
    observaciones?: string;
    isActive?: boolean;
}
