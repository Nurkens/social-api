
import { Entity, Column, PrimaryGeneratedColumn, OneToMany,ManyToMany,JoinTable } from 'typeorm';
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

  @ManyToMany(()=> User,(user) => user.following)
  declare followers: User[];

  @ManyToMany(() => User,(user) => user.followers)
  @JoinTable()
  declare following:User[];

  @OneToMany(()=>Posts,(posts) => posts.author)
  declare posts: Posts[];
  
}
