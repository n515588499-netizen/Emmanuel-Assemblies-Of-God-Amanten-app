const cron = require('node-cron');
const { User, Announcement } = require('../models');
const { emitAnnouncement } = require('./broadcast');

function startDailyJobs() {
  cron.schedule('0 8 * * *', async () => {
    try {
      const today = new Date();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const birthdayUsers = await User.sequelize.query(
        "SELECT * FROM users WHERE to_char(birthday, 'MM-DD') = :mmdd",
        { replacements: { mmdd: `${mm}-${dd}` }, model: User, mapToModel: true }
      );

      for (const u of birthdayUsers) {
        const content = `Happy Birthday, ${u.name}! 🎉`;
        const announcement = await Announcement.create({
          target_audience: 'user',
          target_value: u.id,
          content,
          created_by: null
        });
        emitAnnouncement(announcement);
      }
    } catch (err) {
      console.error('Birthday job error', err);
    }
  }, { timezone: 'UTC' });
}

module.exports = { startDailyJobs };
