import { QrCode } from '../../../models/QrCode';

export type GetOneQrCodeSelections = {
  option1?: {
    qrCodeId?: QrCode['id'];
  };
};

export type CreateQrCodeOptions = Partial<QrCode>;

export type UpdateQrCodeOptions = Partial<QrCode>;
