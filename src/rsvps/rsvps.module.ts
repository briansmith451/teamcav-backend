import { Module } from '@nestjs/common';
import { RsvpsService } from './rsvps.service';
import { RsvpsController } from './rsvps.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventRsvp } from '../entities/rsvp.entity';
import { Membership } from '../entities/membership.entity';
import { Event } from '../entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventRsvp, Membership, Event])],
  controllers: [RsvpsController],
  providers: [RsvpsService],
})
export class RsvpsModule {}