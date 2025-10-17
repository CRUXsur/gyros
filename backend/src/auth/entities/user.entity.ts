import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Prestamo } from "../../prestamos/entities";


@Entity('users')
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;
 
    @Column('text', {
        unique: true,
    })
    email: string;

    @Column('text', {
        select: false,
    })
    password: string;

    @Column('text')
    fullName: string;

    @Column('bool', {
        default: true,
    })
    isActive: boolean;

    @Column('text',{
        array: true,
        default: ['user', 'admin', 'super-user']
    })
    roles: string[];

    @OneToMany(
        () => Prestamo,
        (prestamo) => prestamo.user,
    )
    prestamo: Prestamo;

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }

}
