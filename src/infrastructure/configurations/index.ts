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
    url: process.env.NODE_CLIENT_URL,
    email: process.env.MAIL_FROM_ADDRESS,
    daysOneMonth: Number(process.env.DAYS_ONE_MONTH_SUBSCRIBE),
    amountOneMonth: Number(process.env.AMOUNT_ONE_MONTH_SUBSCRIBE),
    emailNoreply: process.env.MAIL_FROM_NO_REPLAY_ADDRESS,
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
  port: process.env.PORT || 3000,
  /**
   * Database
   */
  database: {
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    name: process.env.POSTGRES_DB,
    ssl: process.env.POSTGRES_SSL,
    logging: process.env.POSTGRES_LOG,
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
     * Amazon s3
     */
    aws: {
      bucket: process.env.AWS_BUCKET,
      accessKey: process.env.AWS_ACCESS_KEY,
      secretKey: process.env.AWS_SECRET_KEY,
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
