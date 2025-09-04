import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRsvpDto } from './dto/create-rsvp.dto';
import { EventRsvp } from '../entities/rsvp.entity';
import { Membership } from '../entities/membership.entity';
import { Event } from '../entities/event.entity';

@Injectable()
export class RsvpsService {
  constructor(
    @InjectRepository(EventRsvp)
    private rsvpsRepository: Repository<EventRsvp>,
    @InjectRepository(Membership)
    private membershipsRepository: Repository<Membership>,
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async createOrUpdate(createRsvpDto: CreateRsvpDto, user: any) {
    console.log('--- HANDLING RSVP ---');
    const { eventId, status } = createRsvpDto;
    const userId = user.userId;

    const event = await this.eventsRepository.findOneBy({ id: eventId });
    if (!event) {
      throw new NotFoundException('Event not found.');
    }

    const membership = await this.membershipsRepository.findOneBy({
      teamId: event.teamId,
      userId: userId,
    });
    if (!membership) {
      throw new UnauthorizedException("You are not a member of this event's team.");
    }

    console.log('Searching for existing RSVP for userId:', userId, 'eventId:', eventId);
    let rsvp = await this.rsvpsRepository.findOneBy({ eventId, userId });
    console.log('Found existing RSVP:', rsvp);

    if (rsvp) {
      console.log('Updating existing RSVP...');
      rsvp.status = status;
    } else {
      console.log('Creating new RSVP...');
      rsvp = this.rsvpsRepository.create({ eventId, userId, status });
    }
    
    console.log('Attempting to save:', rsvp);
    const savedRsvp = await this.rsvpsRepository.save(rsvp);
    console.log('Save successful:', savedRsvp);

    return savedRsvp;
  }

  async findAllForEvent(eventId: number, user: any) {
    const event = await this.eventsRepository.findOneBy({ id: eventId });
    if (!event) {
      throw new NotFoundException('Event not found.');
    }

    const membership = await this.membershipsRepository.findOneBy({
      teamId: event.teamId,
      userId: user.userId,
    });
    if (!membership) {
      throw new UnauthorizedException('You are not a member of this event\'s team.');
    }

    return this.rsvpsRepository.find({
      where: { eventId: eventId },
      relations: ['user'],
    });
  }
}