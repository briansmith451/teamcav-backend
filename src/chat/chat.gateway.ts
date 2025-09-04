import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../entities/message.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    private jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      // Safely check if the authorization header exists
      const authHeader = client.handshake.headers.authorization;
      if (!authHeader) {
        throw new Error('No authorization header');
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new Error('No token found');
      }
      
      const payload = this.jwtService.verify(token);
      client['user'] = payload;
      console.log(`Client connected: ${client.id}, UserID: ${payload.sub}`);
    } catch (e) {
      console.log(`Authentication failed for client ${client.id}:`, e.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string): void {
    client.join(room);
    console.log(`Client ${client.id} joined room: ${room}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() payload: { room: string; content: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const user = client['user'];
    if (!user) {
      // Do not process message if user is not authenticated
      return;
    }
    
    // Assumes room is "team-1", "team-2", etc.
    const conversationId = parseInt(payload.room.replace('team-', ''));

    const newMessage = this.messagesRepository.create({
      senderId: user.sub,
      conversationId: conversationId,
      content: payload.content,
    });
    const savedMessage = await this.messagesRepository.save(newMessage);

    this.server.to(payload.room).emit('newMessage', savedMessage);
  }
} 