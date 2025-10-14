import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cliente } from "../../clientes/entities/cliente.entity";

@Entity('banco_cliente')
export class BancoCliente {
    @PrimaryGeneratedColumn('uuid')
    id_banco_cliente: string;

    @ManyToOne(
        () => Cliente,
        (cliente) => cliente.bancos,
        { onDelete: 'CASCADE' }
    )
    cliente: Cliente;

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

    @Column('timestamp', {
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_at: Date;

    @Column('timestamp', {
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;
}
