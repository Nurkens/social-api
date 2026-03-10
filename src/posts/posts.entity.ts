import { Exclude } from "class-transformer";
import { User } from "src/users/user.entity";
import { Entity, PrimaryGeneratedColumn } from "typeorm";
import { Column } from "typeorm";
import { ManyToOne,ManyToMany,JoinTable} from "typeorm";

@Entity()
export class Posts{

    @PrimaryGeneratedColumn()
    declare id:number;

    @Column()
    declare title:string;

    @Column()
    declare content:string;
    @Exclude()
    @ManyToOne(()=> User,(user)=>user.posts)
    declare author: User;

    @ManyToMany(() => User,(user) =>user.likedPosts)
    @JoinTable()
    declare likes:User[]

    declare likeCounts?:number;


}