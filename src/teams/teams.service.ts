import { Injectable, NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from '../entities/team.entity';
import { Repository } from 'typeorm';
import { Membership } from '../entities/membership.entity';
import { User } from '../entities/user.entity';
import { AddMemberDto } from './dto/add-member.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
    @InjectRepository(Membership)
    private membershipsRepository: Repository<Membership>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createTeamDto: CreateTeamDto, user: any) {
    const newTeam = this.teamsRepository.create(createTeamDto);
    const savedTeam = await this.teamsRepository.save(newTeam);

    const newMembership = this.membershipsRepository.create({
      teamId: savedTeam.id,
      userId: user.userId,
      role: 'Coach',
    });
    await this.membershipsRepository.save(newMembership);

    return savedTeam;
  }

  async addMember(teamId: number, addMemberDto: AddMemberDto, currentUser: any) {
    const coachingMembership = await this.membershipsRepository.findOneBy({
      teamId: teamId,
      userId: currentUser.userId,
      role: 'Coach',
    });

    if (!coachingMembership) {
      throw new UnauthorizedException('You are not a coach of this team.');
    }

    const userToAdd = await this.usersRepository.findOneBy({ email: addMemberDto.email });
    if (!userToAdd) {
      throw new NotFoundException('User with this email does not exist.');
    }

    const existingMembership = await this.membershipsRepository.findOneBy({
      teamId: teamId,
      userId: userToAdd.id,
    });

    if (existingMembership) {
      throw new ConflictException('This user is already on the team.');
    }

    const newMembership = this.membershipsRepository.create({
      teamId: teamId,
      userId: userToAdd.id,
      role: addMemberDto.role,
    });

    return this.membershipsRepository.save(newMembership);
  }
  
  async getRoster(teamId: number, currentUser: any) {
    const membership = await this.membershipsRepository.findOneBy({
      teamId: teamId,
      userId: currentUser.userId,
    });

    if (!membership) {
      throw new UnauthorizedException('You are not a member of this team.');
    }

    return this.membershipsRepository.find({
      where: { teamId: teamId },
      relations: ['user'],
    });
  }

  findAll() {
    return `This action returns all teams`;
  }

  findOne(id: number) {
    return `This action returns a #${id} team`;
  }

  update(id: number, updateTeamDto: UpdateTeamDto) {
    return `This action updates a #${id} team`;
  }

  remove(id: number) {
    return `This action removes a #${id} team`;
  }
}