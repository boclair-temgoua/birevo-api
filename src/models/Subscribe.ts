import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { User } from './User';
import { Organization } from './Organization';
import { Role } from './Role';
import { BaseEntity } from '../infrastructure/databases/common/BaseEntity';
import { SubscribableType } from '../modules/subscribe/dto/validation-subscribe.dto';

@Entity('subscribe')
export class Subscribe extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({
    type: 'uuid',
    unique: true,
    nullable: true,
  })
  uuid!: string;

  @Column({ nullable: true })
  subscribableType?: SubscribableType;

  @Column({ type: 'bigint', nullable: true })
  subscribableId?: number;

  @Column({ type: 'bigint', nullable: true })
  userId?: number;
  @ManyToOne(() => User, (user) => user.subscribes, { onDelete: 'CASCADE' })
  @JoinColumn()
  user?: User;

  @Column({ type: 'bigint', nullable: true })
  organizationId?: number;
  @ManyToOne(() => Organization, (organization) => organization.subscribes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization?: Organization;

  @Column({ type: 'bigint', nullable: true })
  userCreatedId?: number;
  @ManyToOne(() => User, (user) => user.subscribes, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'userCreatedId', referencedColumnName: 'id' }])
  userCreated?: User;

  @Column({ type: 'bigint', nullable: true })
  roleId?: number;
  @ManyToOne(() => Role, (role) => role.subscribes)
  @JoinColumn()
  role?: Role;
}
