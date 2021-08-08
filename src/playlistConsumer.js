require('dotenv').config();

const amqp = require('amqplib');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistSongsService = require('./services/postgres/PlaylistSongsService');
const MailSender = require('./services/nodemailer/MailSender');
const PlaylistListener = require('./listeners/PlaylistListener');
const CacheService = require('./services/redis/CacheService');

const init = async () => {
  const cacheService = new CacheService();
  const playlistsService = new PlaylistsService();
  const playlistSongsService = new PlaylistSongsService(cacheService);
  const mailSender = new MailSender();
  const playlistListener = new PlaylistListener(
    playlistsService, playlistSongsService, mailSender,
  );

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue(process.env.EXPORT_PLAYLIST_CHANNEL, {
    durable: true,
  });

  channel.consume(
    process.env.EXPORT_PLAYLIST_CHANNEL, playlistListener.listen, {
      noAck: true,
    },
  );
};

init();
