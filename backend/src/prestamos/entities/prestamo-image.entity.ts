import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Prestamo } from "./prestamo.entity";



@Entity()
export class PrestamoImage {
    @PrimaryGeneratedColumn()
    id_prestamo_image: number;

    @Column('text')
    url: string;

    @ManyToOne(
        () => Prestamo, 
        (prestamo) => prestamo.images, 
        {onDelete: 'CASCADE'}
    )
    prestamo: Prestamo;



}