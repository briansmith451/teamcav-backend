import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Team } from './team.entity';
import { Message } from './message.entity';

@Entity({ name: 'conversations' })
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  teamId: number;

  @Column()
  name: string;

  @ManyToOne(() => Team, (team) => team.conversations)
  @JoinColumn({ name: 'teamId' })
  team: Team;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];
}