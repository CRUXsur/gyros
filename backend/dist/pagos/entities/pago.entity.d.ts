import { Prestamo } from "../../prestamos/entities/prestamo.entity";
import { Cuota } from "../../cuotas/entities/cuota.entity";
import { User } from "../../auth/entities/user.entity";
export declare class Pago {
    id_pago: string;
    cuota: Cuota;
    prestamo: Prestamo;
    monto_pago: number;
    fecha_pago: Date;
    metodo_pago: string;
    numero_comprobante?: string;
    observaciones?: string;
    isActive: boolean;
    user: User;
}
