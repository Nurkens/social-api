
import { Entity, Column, PrimaryGeneratedColumn, OneToMany,ManyToMany,JoinTable } from 'typeorm';
import {Posts} from '../posts/posts.entity'
import { Exclude } from 'class-transformer';
import { Comments } from '../comments/comment.entity'
import { Transform } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  declare id: number;
  @Exclude()
  @Column({unique:true})
  declare email: string;

  @Exclude()
  @Column()
  declare password: string;

  @Column({unique:true})
  declare username:string;

  @Column({nullable:true})
  declare bio?:string;

  @Transform(({ value }) => {
    if (!value) return null;
    
    if (value.startsWith('http')) return value;
    

    return `http://localhost:9000/avatars/${value}`;
  })  
  @Column({nullable:true})
  declare avatar?:string;

  @ManyToMany(()=> User,(user) => user.following)
  declare followers: User[];

  @ManyToMany(() => User,(user) => user.followers)
  @JoinTable()
  declare following:User[];

  @OneToMany(()=>Posts,(posts) => posts.author)
  declare posts: Posts[];
  
  @ManyToMany(() => Posts, (post) =>post.likes)
  declare likedPosts:Posts[];

  @OneToMany(() =>Comments,(comment)=>comment.author)
  declare comments:Comments[];
}
