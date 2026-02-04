# # -------- BUILD STAGE --------
# FROM node:20 AS build

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .
# RUN npm run build

# # -------- NGINX STAGE --------
# FROM nginx:alpine

# RUN rm /etc/nginx/conf.d/default.conf
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# COPY --from=build /app/dist /usr/share/nginx/html

# EXPOSE 80
# -------- BUILD STAGE --------
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# -------- NGINX STAGE --------
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# install curl for healthcheck
RUN apk add --no-cache curl

# ✅ HEALTHCHECK
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD curl -f http://localhost || exit 1
