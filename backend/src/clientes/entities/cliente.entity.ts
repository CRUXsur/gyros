import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Cliente {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombres: string;

    @Column()
    apellidos: string;

    @Column()
    telefono: string;

    @Column()
    email: string;

    @Column()
    direccion: string;

    @Column()
    ciudad: string;

    @Column()
    pais: string;

    @Column()
    fecha_nacimiento: Date;

    @Column()
    edad: string;

    @Column('text',{
        array: true,
        default: ['mujer', 'hombre']
    })
    sexo: string[];

    @Column()
    estado_civil: string;

    @Column()
    ocupacion: string;

    @Column()
    ingresos: number;

    @Column()
    gastos: number;

    @Column()
    ahorros: number;

    @Column()
    deuda: number;

    @Column()
    credito: number;

    @Column()
    tarjeta: number;

    @Column('bool', {
        default: true,
    })
    isActive: boolean;

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }
    
    
    
    
}
