import { PrestamoImage } from "./";
import { User } from "../../auth/entities/user.entity";
import { Cliente } from "src/clientes/entities/cliente.entity";
export declare class Prestamo {
    id_prestamo: string;
    cliente: Cliente;
    monto_prestado: number;
    tasa_interes: number;
    plazo_meses: number;
    fecha_prestamo: Date;
    fecha_vencimiento: Date;
    isActive: boolean;
    images?: PrestamoImage[];
    user: User;
}
