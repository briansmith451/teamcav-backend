import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Team } from './team.entity';

@Entity({ name: 'memberships' })
export class Membership {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  role: string;

  @Column()
  userId: number;

  @Column()
  teamId: number;

  @ManyToOne(() => User, (user) => user.memberships)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Team, (team) => team.memberships)
  @JoinColumn({ name: 'teamId' })
  team: Team;
}