import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AddMemberDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  role: string; // e.g., 'Player', 'Parent'
}