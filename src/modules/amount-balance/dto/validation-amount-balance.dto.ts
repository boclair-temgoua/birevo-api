import { User } from '../../../models/User';
import { IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateOnAmountBalanceDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  amountId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  userId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  organizationId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  amountBalance: number;
}
