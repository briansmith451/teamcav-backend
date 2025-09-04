import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Conversation } from '../entities/conversation.entity';
import { Membership } from '../entities/membership.entity';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private conversationsRepository: Repository<Conversation>,
    @InjectRepository(Membership)
    private membershipsRepository: Repository<Membership>,
  ) {}

  async findAllForUser(user: any) {
    // 1. Find all memberships for the current user to get their team IDs
    const memberships = await this.membershipsRepository.find({
      where: { userId: user.userId },
    });

    const teamIds = memberships.map((m) => m.teamId);

    if (teamIds.length === 0) {
      return []; // User is not on any teams, so no team chats
    }

    // 2. Find all conversations related to those team IDs
    return this.conversationsRepository.find({
      where: { teamId: In(teamIds) },
    });
  }
}  