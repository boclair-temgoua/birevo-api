import * as dotenv from 'dotenv';
import { TypeDatabase } from '../databases/config';
dotenv.config();

export const isTesting = () =>
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'test' ||
  process.env.NODE_ENV === 'testing';

export const configurations = {
  /**
   * Node environment
   */
  environment: process.env.NODE_ENV || 'development',
  /**
   * Site
   */
  datasite: {
    name: process.env.NODE_NAME,
    url: process.env.NODE_APP_URL,
    pricingBilling: Number(process.env.PRICING_BILLING_VOUCHER),
    urlClient: process.env.NODE_CLIENT_URL,
    email: process.env.MAIL_FROM_ADDRESS,
    daysOneMonth: Number(process.env.DAYS_ONE_MONTH_SUBSCRIBE),
    amountOneMonth: Number(process.env.AMOUNT_ONE_MONTH_SUBSCRIBE),
    emailNoreply: process.env.MAIL_FROM_NO_REPLAY_ADDRESS,
  },
  /**
   * Organization
   */
  organizationAddress: {
    name: 'Berivo',
    company: 'Berivo',
    street1: 'Via della costa 13',
    street2: '',
    city: 'Vigevano',
    zip: '20156',
    country: 'IT',
    phone: '+393425712192',
    email: 'info@birevo.com',
  },
  /**
   * Api
   */
  api: {
    prefix: '/api',
    version: process.env.API_VERSION,
    headerSecretKey: process.env.HEADER_API_SECRET_KEY,
  },
  /**
   * Server port
   */
  port: process.env.PORT || 5500,
  /**
   * Database
   */
  database: {
    url: process.env.DATABASE_URL,
    mysql: {
      type: 'mysql' as TypeDatabase,
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      name: process.env.MYSQL_DB,
      ssl: process.env.MYSQL_SSL,
      logging: process.env.MYSQL_LOG,
    },
    postgres: {
      type: 'postgres' as TypeDatabase,
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      name: process.env.POSTGRES_DB,
      ssl: process.env.POSTGRES_SSL,
      logging: process.env.POSTGRES_LOG,
    },
  },
  /**
   * Show or not console.log
   */
  showLog: true,
  /**
   * Jwt configuration
   */
  jwt: {
    secret: process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRATION,
    expirationPw: process.env.JWT_EXPIRATION_PW,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION,
  },

  /**
   * External implementations
   */
  implementations: {
    /**
     * Birevo marketplace
     */
    birevo: {
      link: process.env.BIREVO_LINK,
      token: process.env.BIREVO_ACCESS_TOKEN,
    },
    /**
     * Stripe
     */
    stripe: {
      key: process.env.STRIPE_PRIVATE_KEY,
    },
    /**
     * Amqp
     */
    amqp: {
      link: process.env.AMQP_LINK,
    },
    /**
     * Ipapi
     */
    ipapi: {
      link: process.env.IPAPI_LINK,
    },
    /**
     * Ip-api
     */
    ip_api: {
      link: process.env.IP_API_LINK,
    },
    /**
     * Sentry
     */
    sentry: process.env.SENTRY_DNS,
    /**
     * Mailtrap
     */
    mailSMTP: {
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
    /**
     * Aws smtp
     */
    awsSMTP: {
      host: process.env.AWS_SMTP_HOST,
      port: Number(process.env.AWS_SMTP_PORT),
      user: process.env.AWS_SMTP_USERNAME,
      pass: process.env.AWS_SMTP_PASSWORD,
      email: process.env.AWS_SMTP_EMAIL,
    },
    /**
     * Mailtrap
     */
    mailjet: {
      apiKey: process.env.MJ_APIKEY_PUBLIC,
      apiSecret: process.env.MJ_APIKEY_PRIVATE,
    },
    /**
     * Amazon s3
     */
    aws: {
      bucket: process.env.AWS_BUCKET,
      accessKey: process.env.AWS_ACCESS_KEY_ID,
      secretKey: process.env.AWS_ACCESS_SECRET_KEY,
      refreshToken: process.env.AWS_REFRESH_TOKEN,
      clientId: process.env.AWS_CLIENT_ID,
      clientSecret: process.env.AWS_CLIENT_SECRET,
      region: process.env.AWS_REGION_NAME,
      auth: {
        host: 'https://api.amazon.com',
      },
      sts: {
        host: 'sts.eu-west-1.amazonaws.com',
        service: 'sts',
      },
      executeApi: {
        host: 'sellingpartnerapi-eu.amazon.com',
        service: 'execute-api',
      },
    },
  },
};
