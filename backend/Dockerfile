FROM node:18

WORKDIR /app

ENV PRISMA_CLIENT_ENGINE_TYPE=binary

# install curl for healthcheck
RUN apt-get update && apt-get install -y curl

COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

EXPOSE 5000
CMD ["npm", "run", "start"]
# ✅ HEALTHCHECK
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1