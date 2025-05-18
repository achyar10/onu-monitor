# Stage 1: Install dependencies
FROM node:23-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install

# Stage 2: Build the application with env
FROM node:23-alpine AS builder
WORKDIR /app

# Set environment variable for Next.js at build time
ARG NEXT_PUBLIC_BASEURL

ENV NEXT_PUBLIC_BASEURL=$NEXT_PUBLIC_BASEURL

COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN npm run build

# Stage 3: Run the application
FROM node:23-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]