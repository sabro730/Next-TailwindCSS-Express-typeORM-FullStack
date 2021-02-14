import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm'

import Model from './Model'
import User from './User'

import Post from './Post'

@Entity('subs')
export default class Sub extends Model {
  constructor(sub: Partial<Sub>) {
    super()
    Object.assign(this, sub)
  }

  @Index()
  @Column({ unique: true })
  name: string

  @Column()
  title: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ nullable: true })
  imageUrn: string

  @Column({ nullable: true })
  bannerUrn: string

  @Column()
  username: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User

  @OneToMany(() => Post, (post) => post.sub)
  posts: Post[]
}
