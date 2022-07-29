import { Type } from 'class-transformer';
import { IsNotEmpty, IsInt, Min } from 'class-validator';
export class RequestPaginationDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number;
}
