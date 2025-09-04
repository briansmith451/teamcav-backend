import { Controller, Post, Body, UseGuards, Request, Param, Get } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AddMemberDto } from './dto/add-member.dto';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTeamDto: CreateTeamDto, @Request() req) {
    return this.teamsService.create(createTeamDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/members')
  addMember(
    @Param('id') id: string,
    @Body() addMemberDto: AddMemberDto,
    @Request() req,
  ) {
    return this.teamsService.addMember(+id, addMemberDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/roster')
  getRoster(@Param('id') id: string, @Request() req) {
    return this.teamsService.getRoster(+id, req.user);
  }
}