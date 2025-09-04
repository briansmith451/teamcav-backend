import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Membership } from './membership.entity';
import { Event } from './event.entity';
import { Conversation } from './conversation.entity';

@Entity({ name: 'teams' })
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  
  @Column()
  sport: string;
  
  @Column({ nullable: true })
  season: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Membership, (membership) => membership.team)
  memberships: Membership[];

  @OneToMany(() => Event, (event) => event.team)
  events: Event[];

  @OneToMany(() => Conversation, (conversation) => conversation.team)
  conversations: Conversation[];
}