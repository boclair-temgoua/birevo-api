import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QrCode } from '../../models/QrCode';
import { CreateOrUpdateQrCodeService } from './services/mutations/create-or-update-qr-code.service';
import { FindOneQrCodeByService } from './services/query/find-one-qr-code-by.service';

@Module({
  imports: [TypeOrmModule.forFeature([QrCode])],
  controllers: [],
  providers: [CreateOrUpdateQrCodeService, FindOneQrCodeByService],
})
export class QrCodeModule {}
