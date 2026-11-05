# -- Builder --
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
ARG APP
RUN npx nest build ${APP}

# -- Runtime --

FROM node:24-alpine

WORKDIR /app

ARG APP
ENV APP=${APP}
ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

USER node
CMD ["sh", "-c", "node dist/apps/${APP}/main.js"]
