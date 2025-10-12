import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class Cliente {
    @PrimaryGeneratedColumn('uuid')
    id_cliente: string;

    @Column()
    nombres: string;

    @Column()
    apellidos: string;

    @Column('text',{
        default: 'Bolivianos'
    })
    moneda: string;

    @Column('float',{
        default: 0
    })
    aporte_mensual: number;

    @Column('text',{
        default: 'no_especificado'
    })
    numero_cuenta: string;

    @Column('text',{
        default: 'no_especificado'
    })
    banco: string;

    @Column('date',{
        nullable: true
    })
    fecha_vto_tarjeta: Date;

    @Column('text',{
        unique: true,
    })
    ci: string;

    @Column()
    fijo: string;
    
    @Column()
    celular: string;

    @Column('text',{
        unique: true,
    })
    device_id: string;

    @Column()
    email: string;

    @Column()
    observaciones: string;

    @Column()
    garante: string;
    
    @Column()
    Celular_garante: string;

    @Column()
    fecha_registro: Date;

    @Column('bool', {
        default: true,
    })
    isActive: boolean;

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
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
