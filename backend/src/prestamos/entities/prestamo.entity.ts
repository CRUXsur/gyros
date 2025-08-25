import{ BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { PrestamoImage } from "./";

@Entity()
export class Prestamo {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text',{ 
        unique: true,
     })
     title: string;

     @Column('float',{
        default: 0
     })
     price: number;

     @Column('text',{
        nullable: true
     })
     description: string;

     @Column('text',{
        unique: true
     })
     slug: string;

     @Column('int',{
        default: 0
     })
     stock: number;

     @Column('text',{
        array: true
     })
     sizes: string[];

     @Column('text')
     gender: string;
     
     @BeforeInsert()
     checkSlugInsert(){
        if(!this.slug){
            this.slug = this.title;
        }
        this.slug = this.slug
         .toLowerCase()
         .replaceAll(' ', '_')
         .replaceAll("'", '');
     }

     @BeforeUpdate()
     checkSlugUpdate(){
        this.slug = this.slug
         .toLowerCase()
         .replaceAll(' ', '_')
         .replaceAll("'", '');
     }

     @Column('text',{
        array: true,
        default: []
     })
     tags: string[];


     @OneToMany(
        () => PrestamoImage, 
        (prestamoImage) => prestamoImage.prestamo,
        { cascade: true, eager: true }
     )
     images?: PrestamoImage[];
}
