#!/bin/sh
set -e

echo "Running database migrations..."
node scripts/migrate.js

echo "Starting Planit Go API on port ${PORT:-4000}..."
exec npm start
