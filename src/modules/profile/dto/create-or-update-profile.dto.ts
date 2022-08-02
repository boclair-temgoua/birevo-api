import { IsString, MaxLength, IsOptional } from 'class-validator';
export class CreateOrUpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName: string;

  @IsOptional()
  @IsString()
  image: string;
}
