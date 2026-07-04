# Emmanuel Assemblies Of God - Amanten App

This repository contains a starter backend and mobile client skeleton for a mobile-first organizational management application. Features include:

- PostgreSQL + Sequelize models (Users, Ministries, Events, Projects, Announcements)
- Role-Based Access Control (RBAC) middleware
- Socket.IO announcement broadcasting with server-side JWT auth
- Daily birthday greeting scheduler (node-cron)
- Idempotent seed script for development
- Dockerfile and docker-compose for local development

Quick start
1. Copy `.env.example` to `.env` and adjust values.
2. Start services with Docker:
   ```
   docker-compose up --build
   ```
3. The seed script will create a default admin (see logs) if `SEED_ON_START=true`.
4. Login: POST /auth/login and use the returned JWT for API requests and socket connections.

Security
- Do not use `SEED_ON_START=true` in production.
- Replace `JWT_SECRET` with a secure value stored in a secrets manager.
- Replace `sequelize.sync()` with migrations before production.

