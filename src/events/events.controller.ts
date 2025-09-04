import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createEventDto: CreateEventDto, @Request() req) {
    return this.eventsService.create(createEventDto, req.user);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('team/:teamId')
  findAllForTeam(@Param('teamId') teamId: string, @Request() req) {
    return this.eventsService.findAllForTeam(+teamId, req.user);
  }
}