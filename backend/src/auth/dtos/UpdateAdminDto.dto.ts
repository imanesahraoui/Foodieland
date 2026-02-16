import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateAdminDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  fullName?: string;
}