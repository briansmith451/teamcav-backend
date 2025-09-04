import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '../entities/event.entity';
import { Repository } from 'typeorm';
import { Membership } from '../entities/membership.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(Membership)
    private membershipsRepository: Repository<Membership>,
  ) {}

  async create(createEventDto: CreateEventDto, user: any) {
    const { teamId } = createEventDto;

    const membership = await this.membershipsRepository.findOneBy({
      teamId: teamId,
      userId: user.userId,
      role: 'Coach',
    });

    if (!membership) {
      throw new UnauthorizedException('Only a coach can create events for this team.');
    }

    const newEvent = this.eventsRepository.create(createEventDto);
    return this.eventsRepository.save(newEvent);
  }

  async findAllForTeam(teamId: number, user: any) {
    const membership = await this.membershipsRepository.findOneBy({
      teamId: teamId,
      userId: user.userId,
    });

    if (!membership) {
      throw new UnauthorizedException('You are not a member of this team.');
    }

    return this.eventsRepository.find({
      where: { teamId: teamId },
      order: { startTime: 'ASC' },
    });
  }
}