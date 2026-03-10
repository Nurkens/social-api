import { Entity, PrimaryGeneratedColumn,Column, ManyToOne} from "typeorm";
import { Posts } from "src/posts/posts.entity";
import { User } from "src/users/user.entity";


@Entity()
export class Comments{

    @PrimaryGeneratedColumn()
    declare id:number;

    @Column()
    declare text:string;

    @ManyToOne(() => Posts,(post) => post.comments)
    declare post: Posts;

    @ManyToOne(()=>User,(user)=>user.comments)
    declare author:User;
}