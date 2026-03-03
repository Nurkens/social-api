
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Posts } from 'src/posts/posts.entity';
import { Exclude } from 'class-transformer';

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

  @OneToMany(()=>Posts,(posts) => posts.author)
  declare posts: Posts[];
  
}
