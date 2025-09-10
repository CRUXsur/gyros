import { Cuota } from "src/cuotas/entities/cuota.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class Pago {
    @PrimaryGeneratedColumn('uuid')
    id_pago: string;

    @ManyToOne(
        () => Cuota,
        { eager: true }
    )
    cuota: Cuota;

    @Column('float')
    monto_pago: number;

    @Column()
    fecha_pago: Date;
    
    @Column('text')
    observaciones: string;

    @Column('bool', {
        default: true,
    })
    isActive: boolean;
}
