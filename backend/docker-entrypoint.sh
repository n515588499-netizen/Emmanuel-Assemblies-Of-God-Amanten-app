#!/bin/sh
set -e

echo "Waiting for DB to accept connections..."
node src/scripts/wait-for-db.js

if [ "$SEED_ON_START" = "true" ]; then
  echo "SEED_ON_START=true — running seed script (dev only)..."
  npm run seed || echo "Seed script failed or already ran; continuing..."
fi

exec "$@"
