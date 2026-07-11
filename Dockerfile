# Use the official Node.js 22 alpine image for the build stage
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Use a smaller image for production
FROM node:22-alpine AS production

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /usr/src/app/dist ./dist

# Pass the port dynamically via an env variable if needed
ENV PORT=3000
EXPOSE 3000

CMD ["node", "dist/main"]
