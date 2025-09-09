import{ BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm";
import { PrestamoImage } from "./";
import { User } from "../../auth/entities/user.entity";
import { Cliente } from "src/clientes/entities/cliente.entity";


@Entity()
export class Prestamo {
    @PrimaryGeneratedColumn('uuid')
    id_prestamo: string;

    @ManyToOne(
        () => Cliente,
        { eager: true }
    )
    cliente: Cliente;

    @Column('float',{
      default: 0
     })
     monto_prestado: number;

    @Column('float',{
      default: 0
     })
     tasa_interes: number;

    @Column('int',{
      default: 0
     })
     plazo_meses: number;

    @Column()
     fecha_prestamo: Date;

    @Column()
     fecha_vencimiento: Date;
 
    @Column('bool', {
         default: true,
     })
     isActive: boolean;

     
     @OneToMany(
        () => PrestamoImage, 
        (prestamoImage) => prestamoImage.prestamo,
        { cascade: true, eager: true }
     )
     images?: PrestamoImage[];


     @ManyToOne(
      () => User,
      (user) => user.prestamo,
      { eager: true }
     )
     user: User;

}
