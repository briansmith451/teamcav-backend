import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Membership } from './membership.entity';
import { EventRsvp } from './rsvp.entity';
import { Message } from './message.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Membership, (membership) => membership.user)
  memberships: Membership[];

  @OneToMany(() => EventRsvp, (rsvp) => rsvp.user)
  rsvps: EventRsvp[];

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];
}