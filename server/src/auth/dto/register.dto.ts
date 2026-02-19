import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsStrongPassword,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    example: 'Str0ng!Pass',
    description: 'Password (min 8 chars, 1 digit, 1 symbol, 1 upper, 1 lower)',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(32, { message: 'Password must be at most 32 characters' })
  @IsStrongPassword(
    {
      minLength: 8,
      minNumbers: 1,
      minSymbols: 1,
      minLowercase: 1,
      minUppercase: 1,
    },
    {
      message:
        'Password must contain at least 1 digit, 1 special character, 1 lowercase and 1 uppercase letter',
    },
  )
  password: string;

  @ApiPropertyOptional({ example: 'Denis', description: 'Display name' })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(22, { message: 'Name must be at most 22 characters' })
  name?: string;
}
