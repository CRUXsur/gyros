import { Prestamo } from "../../prestamos/entities";
export declare class User {
    id: string;
    email: string;
    password: string;
    fullName: string;
    isActive: boolean;
    roles: string[];
    prestamo: Prestamo;
    checkFieldsBeforeInsert(): void;
    checkFieldsBeforeUpdate(): void;
}
