import { newApplicationMail } from '../mails';

/** Send Job Application */
export const newApplicationJob = async (options: { channel; queue }) => {
  const { channel, queue } = { ...options };

  await channel.consume(
    queue,
    async (msg) => {
      const saveItem = JSON.parse(msg.content.toString());
      console.log(
        '\x1b[33m%s\x1b[0m',
        '**** Processing new application start ****',
      );
      newApplicationMail({ item: saveItem });
      console.log(
        '\x1b[32m%s\x1b[0m',
        '**** Processed new application finish ****',
      );
    },
    { noAck: true },
  );
};
