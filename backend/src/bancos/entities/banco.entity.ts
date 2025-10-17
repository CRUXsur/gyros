import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Banco {
    @PrimaryGeneratedColumn('uuid')
    id_banco: string;

    @Column('text')
    banco: string;

    @Column('text')
    noCta: string;

    @Column('text')
    nombre: string;

    @Column('text')
    moneda: string;

    @Column('bool', {
        default: true,
    })
    isActive: boolean;
}

