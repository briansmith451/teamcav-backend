import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { EventsModule } from './events/events.module';
import { RsvpsModule } from './rsvps/rsvps.module';
import { ChatModule } from './chat/chat.module';
import { ConversationsModule } from './conversations/conversations.module';
import { User } from './entities/user.entity';
import { Team } from './entities/team.entity';
import { Membership } from './entities/membership.entity';
import { Event } from './entities/event.entity';
import { EventRsvp } from './entities/rsvp.entity';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'P51Mustang!!', // Make sure this is your correct password
      database: 'teamcav_dev',
      entities: [
        User,
        Team,
        Membership,
        Event,
        EventRsvp,
        Conversation,
        Message,
      ],
      synchronize: true,
    }),
    UsersModule,
    TeamsModule,
    EventsModule,
    RsvpsModule,
    ChatModule,
    ConversationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}