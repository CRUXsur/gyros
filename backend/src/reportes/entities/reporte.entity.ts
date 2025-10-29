import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../auth/entities/user.entity";

@Entity()
export class Reporte {
    @PrimaryGeneratedColumn('uuid')
    id_reporte: string;

    @ManyToOne(
        () => User,
        { eager: true }
    )
    user: User;

    @UpdateDateColumn()
    fecha_hora_actualizacion: Date;

    @Column('float', {
        default: 0
    })
    capital_prestado: number;

    @Column('float', {
        default: 0
    })
    intereses: number;

    @Column('float', {
        default: 0
    })
    capital_disponible: number;

    @Column('bool', {
        default: true,
    })
    isActive: boolean;
}

