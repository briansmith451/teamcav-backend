import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRsvpDto {
  @IsNumber()
  @IsNotEmpty()
  eventId: number;

  @IsString()
  @IsIn(['Going', 'Not Going', 'Maybe'])
  status: string;
}