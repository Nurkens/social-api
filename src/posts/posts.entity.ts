import { Exclude } from "class-transformer";
import { User } from '../users/user.entity'
import { DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Column } from "typeorm";
import { ManyToOne,ManyToMany,JoinTable,OneToMany} from "typeorm";
import { Comments } from '../comments/comment.entity'
import { Transform } from "class-transformer";

@Entity()
export class Posts{

    @PrimaryGeneratedColumn()
    declare id:number;

    @Column()
    declare title:string;

    @Column()
    declare content:string;

    @Transform(({value}) =>{
        if(!value) return null
        if(value.startsWith('http')) return value
        
        return `http://localhost:9000/posts/${value}`
    })
    @Column({nullable:true})
    declare image?:string;
    
    @DeleteDateColumn()
    declare deletedAt:Date;

    @Exclude()
    @ManyToOne(()=> User,(user)=>user.posts)
    declare author: User;

    @ManyToMany(() => User,(user) =>user.likedPosts)
    @JoinTable()
    declare likes:User[]

    @OneToMany(()=>Comments,(comment) =>comment.post)
    declare comments:Comments[];


    declare likeCount?:number;


}