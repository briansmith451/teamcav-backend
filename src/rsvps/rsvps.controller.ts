import { Controller, Post, Body, UseGuards, Request, Get, Param } from '@nestjs/common';
import { RsvpsService } from './rsvps.service';
import { CreateRsvpDto } from './dto/create-rsvp.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('rsvps')
export class RsvpsController {
  constructor(private readonly rsvpsService: RsvpsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createRsvpDto: CreateRsvpDto, @Request() req) {
    return this.rsvpsService.createOrUpdate(createRsvpDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('event/:eventId')
  findAllForEvent(@Param('eventId') eventId: string, @Request() req) {
    return this.rsvpsService.findAllForEvent(+eventId, req.user);
  }
}