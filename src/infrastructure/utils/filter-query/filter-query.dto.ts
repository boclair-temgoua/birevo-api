import { IsOptional, IsString, NotEquals, ValidateIf } from 'class-validator';
export class FilterQueryDto {
  @IsString()
  @IsOptional()
  @NotEquals(null)
  @NotEquals('')
  @ValidateIf((object, value) => value !== undefined)
  q?: string;
}
