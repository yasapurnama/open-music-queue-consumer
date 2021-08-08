const nodemailer = require('nodemailer');

class MailSender {
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: process.env.MAIL_SECURE,
      ssl: process.env.MAIL_ENCRYPTION === 'ssl',
      tls: process.env.MAIL_ENCRYPTION === 'tls',
      auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  sendEmail(targetEmail, playlistName, content) {
    const message = {
      from: '"Open Music" <no-reply@open-music.com>',
      to: targetEmail,
      subject: `Ekspor Lagu Playlist ${playlistName}`,
      text: `Terlampir hasil ekspor lagu dari playlist ${playlistName}`,
      attachments: [
        {
          filename: 'songs.json',
          content,
        },
      ],
    };

    return this._transporter.sendMail(message);
  }
}

module.exports = MailSender;
