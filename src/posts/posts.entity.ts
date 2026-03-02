import { User } from "src/users/user.entity";
import { Entity, PrimaryGeneratedColumn } from "typeorm";
import { Column } from "typeorm";
import { ManyToOne } from "typeorm";

@Entity()
export class Posts{

    @PrimaryGeneratedColumn()
    declare id:number;

    @Column()
    declare title:string;

    @Column()
    declare content:string;

    @ManyToOne(()=> User,(user)=>user.posts)
    declare author: User;

    


}