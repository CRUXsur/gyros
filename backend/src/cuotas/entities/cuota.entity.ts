import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Prestamo } from "../../prestamos/entities/prestamo.entity";
import { User } from "../../auth/entities/user.entity";

@Entity()
export class Cuota {
    @PrimaryGeneratedColumn('uuid')
    id_cuota: string;

    @ManyToOne(
        () => Prestamo,
        { eager: true }
    )
    prestamo: Prestamo;

    @Column('int')
    numero_cuota: number;

    @Column('float')
    monto_cuota: number;

    @Column('float', {
        default: 0
    })
    monto_pagado: number;

    @Column()
    fecha_vencimiento: Date;

    @Column({
        nullable: true
    })
    fecha_pago?: Date;

    @Column('text', {
        default: 'pendiente'
    })
    estado: string; // pendiente, pagado, vencido

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