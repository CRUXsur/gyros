import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class Cliente {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombres: string;

    // @Column()
    // apellidos: string;

    @Column('text',{
        unique: true,
    })
    ci: string;

    // @Column('text',{
    //     nullable: true,
    // })
    // imei: string;
    
    @Column()
    telefono: string;

    @Column('text',{
        unique: true,
    })
    device_id: string;

    @Column()
    email: string;

    // @Column()
    // direccion: string;

    // @Column()
    // ciudad: string;

    // @Column()
    // pais: string;

    // @Column()
    // fecha_nacimiento: Date;

    // @Column()
    // edad: string;

    @Column('text',{
        array: true,
        default: ['mujer', 'hombre']
    })
    sexo: string[];

    @Column('text',{
        array: true,
        default: ['soltero', 'casado', 'divorciado', 'viudo']
    })
    estado_civil: string[];

    // @Column()
    // ocupacion: string;

    // @Column('float',{
    //     default: 0,
    // })
    // ingresos: number;

    // @Column('float',{
    //     default: 0,
    // })
    // gastos: number;

    // @Column('float',{
    //     default: 0,
    // })
    // ahorros: number;

    // @Column('float',{
    //     default: 0,
    // })
    // deuda: number;

    // @Column('float',{
    //     default: 0,
    // })
    // credito: number;

    // @Column()
    // tarjeta: string;

    @Column('bool', {
        default: true,
    })
    isActive: boolean;

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
        this.ci = this.ci.toString().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }
    
    
    
    
}
