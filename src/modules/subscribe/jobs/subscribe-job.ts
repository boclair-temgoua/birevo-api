import { newContributorNotificationMail } from '../mails/new-contributor-notification-mail';

/** Send Job Reset password */
export const subscribeJob = async (options: { channel; queue }) => {
  const { channel, queue } = { ...options };

  await channel.consume(
    queue,
    async (msg) => {
      const saveItem = JSON.parse(msg.content.toString());
      console.log(
        '\x1b[33m%s\x1b[0m',
        '**** Processing mail contributor Job message user start ****',
      );
      newContributorNotificationMail({ item: saveItem });
      console.log(
        '\x1b[32m%s\x1b[0m',
        '**** Processed mail contributor Job message user finish ****',
      );
    },
    { noAck: true },
  );
};
