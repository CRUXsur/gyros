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

    @Column()
    direccion: string;

    @Column('text',{
        default: 'no_especificado'
    })
    sexo: string;

    @Column('text',{
        default: 'soltero'
    })
    estado_civil: string;

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

    // @Column()
    // ciudad: string;

    // @Column()
    // pais: string;

    // @Column()
    // fecha_nacimiento: Date;

    // @Column()
    // edad: string;

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
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }
    
    
    
    
}
