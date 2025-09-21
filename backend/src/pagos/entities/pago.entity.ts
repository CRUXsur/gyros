import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Prestamo } from "../../prestamos/entities/prestamo.entity";
import { Cuota } from "../../cuotas/entities/cuota.entity";
import { User } from "../../auth/entities/user.entity";

@Entity()
export class Pago {
    @PrimaryGeneratedColumn('uuid')
    id_pago: string;

    @ManyToOne(
        () => Cuota,
        { eager: true }
    )
    cuota: Cuota;

    @ManyToOne(
        () => Prestamo,
        { eager: true }
    )
    prestamo: Prestamo;

    @Column('float')
    monto_pago: number;

    @Column()
    fecha_pago: Date;
    
    @Column('text', {
        default: 'efectivo'
    })
    metodo_pago: string; // efectivo, transferencia, cheque, tarjeta

    @Column('text', {
        nullable: true
    })
    numero_comprobante?: string;

    @Column('text', {
        nullable: true
    })
    observaciones?: string;

    @Column('bool', {
        default: true,
    })
    isActive: boolean;

    @ManyToOne(
        () => User,
        { eager: true }
    )
    user: User;
}
