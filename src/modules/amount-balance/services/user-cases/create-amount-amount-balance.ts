import { FindAmountUsageService } from '../../../amount-usage/services/query/find-amount-usage.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { useCatch } from '../../../../infrastructure/utils/use-catch';
import { CreateOrUpdateAmountBalanceService } from '../mutations/create-or-update-amount-balance.service';
import { CreateOrUpdateAmountService } from '../../../amount/services/mutations/create-or-update-amount.service';
import { Cron, Interval } from '@nestjs/schedule';
import { formateDateMountYearMomentJs } from '../../../../infrastructure/utils/commons';
import { FindAmountBalanceService } from '../query/find-amount-balance.service';
import { CreateOrUpdateUserService } from '../../../user/services/mutations/create-or-update-user.service';
import * as excel from 'exceljs';
import { S3 } from 'aws-sdk';
import { configurations } from '../../../../infrastructure/configurations/index';
import { FindOneAmountBalanceByService } from '../query/find-one-amount-balance-by.service';
import { CreatePdfAndSendMailAmountAmountBalance } from './create-pdf-and-send-mail-amount-amount-balance';
import { CreateOrUpdateOrganizationService } from '../../../organization/services/mutations/create-or-update-organization.service';

const s3 = new S3({
  region: configurations.implementations.aws.region,
  accessKeyId: configurations.implementations.aws.accessKey,
  secretAccessKey: configurations.implementations.aws.secretKey,
});
@Injectable()
export class CreateAmountAmountBalance {
  constructor(
    private readonly findAmountUsageService: FindAmountUsageService,
    private readonly findAmountBalanceService: FindAmountBalanceService,
    private readonly createOrUpdateAmountService: CreateOrUpdateAmountService,
    private readonly createOrUpdateOrganizationService: CreateOrUpdateOrganizationService,
    private readonly createOrUpdateAmountBalanceService: CreateOrUpdateAmountBalanceService,
    private readonly createPdfAndSendMailAmountAmountBalance: CreatePdfAndSendMailAmountAmountBalance,
  ) {}

  /** Confirm account token to the database. */
  @Cron('30 0 1 * *') // 31 days
  // @Interval(5000)
  // @Cron('50 * * * * *')
  async executeJobSaveBalance(): Promise<any> {
    const [errorSaveAmount, amountUsages] = await useCatch(
      this.findAmountUsageService.findAll({}),
    );
    if (errorSaveAmount) {
      throw new NotFoundException(errorSaveAmount);
    }

    /** Amount balance */
    console.log('\x1b[33m%s\x1b[0m', '**** Stated Job create balance ****');
    Promise.all([
      amountUsages.map(async (item) => {
        /** Save Amount */
        const [errorSaveAmount, amountSave] = await useCatch(
          this.createOrUpdateAmountService.createOne({
            amount: item?.amountUsage,
            userId: item?.userId,
            currency: 'EUR',
            type: 'BALANCE',
            description: `Balance for ${formateDateMountYearMomentJs(
              item?.lastMonth,
            )}`,
            organizationId: item?.organizationId,
          }),
        );
        if (errorSaveAmount) {
          throw new NotFoundException(errorSaveAmount);
        }
        /** Save AmountBalance */
        const [errorSaveAmountBa, amountBalance] = await useCatch(
          this.createOrUpdateAmountBalanceService.createOne({
            amountId: amountSave?.id,
            userId: amountSave?.userId,
            amountBalance: amountSave?.amount,
            monthAmountBalanceAt: item?.lastMonth,
            organizationId: amountSave?.organizationId,
          }),
        );
        if (errorSaveAmountBa) {
          throw new NotFoundException(errorSaveAmountBa);
        }
        /** Save to aws XML */
        this.executeBalanceXMLExecute({ amount: amountSave, amountBalance });

        /** Save to aws PDF */
        this.createPdfAndSendMailAmountAmountBalance.executeGeneratePDF({
          amount: amountSave,
        });
        console.log(`amountBalance ====>`, amountBalance);
      }),
    ]);
    console.log(
      '\x1b[32m%s\x1b[0m',
      `**** End Job create balance ${new Date().toISOString()} ****`,
    );

    return 'amountSubSave';
  }

  /** Confirm account token to the database. */
  @Cron('30 0 15 * *') //Execute every 15 days
  // @Interval(5000)
  async executeJobControlIfPaymentExecute(): Promise<any> {
    const [errorSaveAmount, findAmountBalances] = await useCatch(
      this.findAmountBalanceService.findAll({}),
    );
    if (errorSaveAmount) {
      throw new NotFoundException(errorSaveAmount);
    }

    /** Amount balance */
    console.log(
      '\x1b[33m%s\x1b[0m',
      '**** Start Job Control if payment execute ****',
    );
    /** Control and filter all amount negative */
    const amountBalances = findAmountBalances?.filter(
      (balance) => balance?.amountBalance < 0,
    );
    Promise.all([
      amountBalances.map(async (item) => {
        /** Save Amount */
        const [errorUpdateUser, updateOrganization] = await useCatch(
          this.createOrUpdateOrganizationService.updateOne(
            { option1: { organizationId: item.organizationId } },
            {
              requiresPayment: true,
            },
          ),
        );
        if (errorUpdateUser) {
          throw new NotFoundException(errorUpdateUser);
        }
      }),
    ]);
    console.log(
      '\x1b[32m%s\x1b[0m',
      `**** End Job Control if payment execute  on ${new Date().toISOString()} ****`,
    );

    return 'amountSubSave';
  }

  /** Generate XML SaveBalance */
  async executeBalanceXMLExecute({ amount, amountBalance }): Promise<any> {
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet();
    worksheet.columns = [
      {
        header: `description`,
        key: 'description',
        width: 40,
        style: { alignment: { vertical: 'middle', horizontal: 'left' } },
      },
      {
        header: `hours`,
        key: 'hours',
        width: 40,
        style: { alignment: { vertical: 'middle', horizontal: 'left' } },
      },
      {
        header: `start`,
        key: 'start',
        width: 40,
        style: {
          numFmt: 'dd/mm/yyyy',
          alignment: { vertical: 'middle', horizontal: 'left' },
        },
      },
      {
        header: `end`,
        key: 'end',
        width: 40,
        style: {
          numFmt: 'dd/mm/yyyy',
          alignment: { vertical: 'middle', horizontal: 'left' },
        },
      },
      {
        header: `total`,
        key: 'total',
        width: 40,
        style: { alignment: { vertical: 'middle', horizontal: 'left' } },
      },
      {
        header: `currency`,
        key: 'currency',
        width: 40,
        style: { alignment: { vertical: 'middle', horizontal: 'left' } },
      },
    ];
    const rowsItem = {
      description: amount?.description,
      hours: 744,
      start: amountBalance?.monthAmountBalanceAt,
      end: amountBalance?.createdAt,
      total: amount?.amount,
      currency: amount?.currency,
    };
    worksheet.addRow(rowsItem);
    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = `${
      configurations.datasite.name
    } Invoice ${formateDateMountYearMomentJs(
      amountBalance?.monthAmountBalanceAt,
    )} (${amount?.id}-${amount?.invoiceNumber}).xlsx`;
    const params = {
      Bucket: `${configurations.implementations.aws.bucket}/invoices`,
      Key: fileName,
      Body: buffer,
      ACL: 'public-read',
      contentType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: configurations.implementations.aws.region,
      },
    };

    const s3Response = await s3.upload(params).promise();
    const [errorUpdateAmount, amountUpdate] = await useCatch(
      this.createOrUpdateAmountService.updateOne(
        { option1: { amountId: amount?.id } },
        { urlXml: s3Response?.Location },
      ),
    );
    if (errorUpdateAmount) {
      throw new NotFoundException(errorUpdateAmount);
    }
  }
}
