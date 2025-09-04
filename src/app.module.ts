import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
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

// Define the database options in a variable
const getTypeOrmConfig = (): TypeOrmModuleOptions => {
  if (process.env.NODE_ENV === 'production') {
    // Production configuration for Render
    return {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
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
    };
  } else {
    // Local development configuration
    return {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'YOUR_PASSWORD_HERE', // <-- Make sure this is your correct local password
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
    };
  }
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(getTypeOrmConfig()), // Use the function here
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
