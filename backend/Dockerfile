FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY src ./src
RUN mkdir -p /app/uploads
ENV NODE_ENV=production SERVER_PORT=5000
EXPOSE 5000
CMD ["node", "src/server.js"]