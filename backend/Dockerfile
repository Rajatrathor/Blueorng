FROM node:18

WORKDIR /app

ENV PRISMA_CLIENT_ENGINE_TYPE=binary

COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

EXPOSE 5000
CMD ["npm", "run", "start"]
