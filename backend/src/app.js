require('dotenv').config();
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const ministryRoutes = require('./routes/ministries');
const announcementRoutes = require('./routes/announcements');
const broadcast = require('./services/broadcast');
const { startDailyJobs } = require('./services/scheduler');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/ministries', ministryRoutes);
app.use('/announcements', announcementRoutes);

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// Initialize socket.io
broadcast.init(server);

(async function bootstrap() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    startDailyJobs();
  } catch (err) {
    console.error('Failed to start', err);
  }
})();
