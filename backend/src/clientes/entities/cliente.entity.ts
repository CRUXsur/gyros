import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BancoCliente } from "../../banco-cliente/entities/banco-cliente.entity";



@Entity()
export class Cliente {
    @PrimaryGeneratedColumn('uuid')
    id_cliente: string;

    @Column()
    nombrecompleto: string;

    @Column('text',{
        unique: true,
    })
    ci: string;

    @Column('text',{
        nullable: true
    })
    celular: string;

    @Column('text',{
        nullable: true
    })
    fijo: string;

    @Column('bool', {
        default: true,
    })
    isActive: boolean;

    @Column('text',{
        unique: true,
        nullable: true
    })
    device_id: string;

    @Column('date',{
        nullable: true
    })
    fecha_vto_tarjeta: Date;

    @Column('text',{
        nullable: true
    })
    sector: string;

    @Column('text',{
        unique: true,
        nullable: true
    })
    codigo: string;

    @Column('text',{
        default: 'no_especificado'
    })
    banco: string;

    @Column('text',{
        unique: true,
        default: 'no_especificado'
    })
    numero_cuenta: string;

    @Column('text',{
        default: 'Bolivianos'
    })
    moneda: string;

    @Column('text',{
        nullable: true
    })
    garante: string;

    @Column('text',{
        nullable: true
    })
    celular_garante: string;

    @Column('text',{
        nullable: true
    })
    observaciones: string;

    @Column('date',{
        nullable: true
    })
    fecha_registro: Date;

    @OneToMany(
        () => BancoCliente,
        (bancoCliente) => bancoCliente.cliente,
        { cascade: true, eager: false }
    )
    bancos: BancoCliente[];


    // @Column('text',{
    //     nullable: true
    // })
    // email: string;


    @BeforeInsert()
    checkFieldsBeforeInsert() {
        //this.email = this.email.toLowerCase().trim();
        this.ci = this.ci.toString().trim();
        
        // Set fecha_registro to current date and time if not provided
        if (!this.fecha_registro) {
            this.fecha_registro = new Date();
        }
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }
    
    
    
    
}
