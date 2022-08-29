import {
  authUserVerifyIsConfirmMail,
  authLoginNotificationMail,
  authPasswordResetMail,
} from '../mails';

export const authRegisterJob = async (options: { channel; queue }) => {
  const { channel, queue } = { ...options };

  await channel.consume(
    queue,
    async (msg) => {
      const saveItem = JSON.parse(msg.content.toString());
      console.log(
        '\x1b[33m%s\x1b[0m',
        '**** Processing Job message user start ****',
      );
      authUserVerifyIsConfirmMail({ user: saveItem });
      console.log(
        '\x1b[32m%s\x1b[0m',
        '**** Processed Job message user finish ****',
      );
    },
    { noAck: true },
  );
};

/** Send Job Login */
export const authLoginJob = async (options: { channel; queue }) => {
  const { channel, queue } = { ...options };

  await channel.consume(
    queue,
    async (msg) => {
      const saveItem = JSON.parse(msg.content.toString());
      console.log(
        '\x1b[33m%s\x1b[0m',
        '**** Processing login Job message user start ****',
      );
      authLoginNotificationMail({ user: saveItem });
      console.log(
        '\x1b[32m%s\x1b[0m',
        '**** Processed login Job message user finish ****',
      );
    },
    { noAck: true },
  );
};

/** Send Job Reset password */
export const authPasswordResetJob = async (options: { channel; queue }) => {
  const { channel, queue } = { ...options };

  await channel.consume(
    queue,
    async (msg) => {
      const saveItem = JSON.parse(msg.content.toString());
      console.log(
        '\x1b[33m%s\x1b[0m',
        '**** Processing reset password Job message user start ****',
      );
      authPasswordResetMail({ resetPassword: saveItem });
      console.log(
        '\x1b[32m%s\x1b[0m',
        '**** Processed reset password Job message user finish ****',
      );
    },
    { noAck: true },
  );
};
