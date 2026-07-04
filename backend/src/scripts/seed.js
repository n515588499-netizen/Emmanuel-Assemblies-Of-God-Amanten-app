require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, User, Ministry, Event, Project, Announcement } = require('../models');

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';

async function seed() {
  try {
    console.log('Connecting to DB...');
    await sequelize.authenticate();
    console.log('Syncing DB (no destructive changes).');
    await sequelize.sync();

    let admin = await User.findOne({ where: { email: ADMIN_EMAIL } });
    if (!admin) {
      const adminHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
      admin = await User.create({
        name: 'Super Admin',
        email: ADMIN_EMAIL,
        password_hash: adminHash,
        role: 'admin',
        ministry_id: null,
        profile_photo_url: null,
        contact_info: { phone: '000-000-0000' }
      });
      console.log(`Created admin: ${ADMIN_EMAIL}`);
    } else {
      console.log(`Admin already exists: ${ADMIN_EMAIL}`);
    }

    const [ministryA, createdA] = await Ministry.findOrCreate({ where: { name: 'Youth Ministry' }, defaults: {} });
    const [ministryB, createdB] = await Ministry.findOrCreate({ where: { name: 'Outreach Committee' }, defaults: {} });
    console.log(`Ministries ensured: ${ministryA.name}, ${ministryB.name}`);

    const leaderEmail1 = 'alice@example.com';
    const leaderEmail2 = 'bob@example.com';
    let leader1 = await User.findOne({ where: { email: leaderEmail1 } });
    let leader2 = await User.findOne({ where: { email: leaderEmail2 } });
    const leaderPassHash = await bcrypt.hash(process.env.SEED_LEADER_PASSWORD || 'LeaderPass1!', 10);

    if (!leader1) {
      leader1 = await User.create({
        name: 'Alice Leader',
        email: leaderEmail1,
        password_hash: leaderPassHash,
        role: 'member',
        ministry_id: ministryA.id,
        contact_info: { phone: '111-111-1111' }
      });
      console.log(`Created leader: ${leaderEmail1}`);
    } else {
      if (!leader1.ministry_id) { leader1.ministry_id = ministryA.id; await leader1.save(); }
      console.log(`Leader exists: ${leaderEmail1}`);
    }

    if (!leader2) {
      leader2 = await User.create({
        name: 'Bob Leader',
        email: leaderEmail2,
        password_hash: leaderPassHash,
        role: 'member',
        ministry_id: ministryB.id,
        contact_info: { phone: '222-222-2222' }
      });
      console.log(`Created leader: ${leaderEmail2}`);
    } else {
      if (!leader2.ministry_id) { leader2.ministry_id = ministryB.id; await leader2.save(); }
      console.log(`Leader exists: ${leaderEmail2}`);
    }

    if (!ministryA.leader_id) { ministryA.leader_id = leader1.id; await ministryA.save(); }
    if (!ministryB.leader_id) { ministryB.leader_id = leader2.id; await ministryB.save(); }

    const members = [
      { name: 'Charlie Member', email: 'charlie@example.com', ministry_id: ministryA.id },
      { name: 'Dana Birthday', email: 'dana@example.com', ministry_id: ministryB.id, birthdayRelativeYearsAgo: 25 }
    ];

    for (const m of members) {
      let u = await User.findOne({ where: { email: m.email } });
      if (!u) {
        const pwHash = await bcrypt.hash(process.env.SEED_MEMBER_PASSWORD || 'MemberPass1!', 10);
        const birthday = m.birthdayRelativeYearsAgo ? (() => { const d = new Date(); const yyyy = d.getFullYear() - m.birthdayRelativeYearsAgo; const mm = String(d.getMonth() + 1).padStart(2, '0'); const dd = String(d.getDate()).padStart(2, '0'); return `${yyyy}-${mm}-${dd}`; })() : null;
        await User.create({ name: m.name, email: m.email, password_hash: pwHash, role: 'member', ministry_id: m.ministry_id, contact_info: { phone: '000-000-0000' }, birthday });
        console.log(`Created member: ${m.email}`);
      } else {
        console.log(`Member exists: ${m.email}`);
      }
    }

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    const e1 = await Event.findOne({ where: { name: 'Youth Meetup', ministry_id: ministryA.id } });
    if (!e1) { await Event.create({ ministry_id: ministryA.id, name: 'Youth Meetup', date: todayStr }); console.log('Created event: Youth Meetup'); }

    const p1 = await Project.findOne({ where: { committee_id: ministryA.id, status: 'planning' } });
    if (!p1) { await Project.create({ committee_id: ministryA.id, status: 'planning', budget: 10000.0, tasks: [ { id: 't1', title: 'Define scope', status: 'done' }, { id: 't2', title: 'Budget approval', status: 'pending' } ] }); console.log('Created sample project for ministry A'); }

    const annGlobal = await Announcement.findOne({ where: { content: 'Welcome to the system — this is a seeded global announcement.' } });
    if (!annGlobal) { await Announcement.create({ target_audience: 'all', target_value: null, content: 'Welcome to the system — this is a seeded global announcement.', created_by: admin.id }); console.log('Created global announcement'); }

    console.log('Seeding finished (idempotent run).');
    console.log(`Admin login -> email=${ADMIN_EMAIL} password=${ADMIN_PASSWORD}`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
