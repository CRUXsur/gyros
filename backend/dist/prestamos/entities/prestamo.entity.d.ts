import { PrestamoImage } from "./";
import { User } from "../../auth/entities/user.entity";
export declare class Prestamo {
    id: string;
    monto: number;
    nocuotas: number;
    capital: number;
    interes: number;
    saldo: number;
    images?: PrestamoImage[];
    user: User;
}
