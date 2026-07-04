FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --silent

# Copy app source
COPY . .

# Ensure entrypoint script is executable
RUN chmod +x ./docker-entrypoint.sh

ENV NODE_ENV=development
EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["npm", "run", "dev"]
