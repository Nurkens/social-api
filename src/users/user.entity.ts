
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Posts } from 'src/posts/posts.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  declare id: number;

  @Column()
  declare email: string;

  @Column()
  declare password: string;

  @OneToMany(()=>Posts,(posts) => posts.author)
  declare posts: Posts[];
  
}
