import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsInt,
  Min,
  IsString,
  IsPositive,
  IsIn,
  IsOptional,
} from 'class-validator';

export type SortType = 'ASC' | 'DESC';
export class RequestPaginationDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsPositive()
  limit: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsPositive()
  page: number;

  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  @Type(() => String)
  sort: SortType;
}
