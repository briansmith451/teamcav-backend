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
    console.log(`--- Finding conversations for userId: ${user.userId} ---`);

    // 1. Find all memberships for the current user
    const memberships = await this.membershipsRepository.find({
      where: { userId: user.userId },
    });
    console.log(`Found ${memberships.length} memberships.`);

    const teamIds = memberships.map((m) => m.teamId);
    console.log(`User is a member of team IDs: ${teamIds.join(', ')}`);

    if (teamIds.length === 0) {
      console.log('User is not on any teams, returning empty array.');
      return [];
    }

    // 2. Find all conversations related to those team IDs
    const conversations = await this.conversationsRepository.find({
      where: { teamId: In(teamIds) },
    });
    console.log(`Found ${conversations.length} conversations for those teams.`);

    return conversations;
  }
}