FROM node:20-alpine AS builder
WORKDIR /application
COPY . .
RUN yarn install --immutable && \
    yarn workspace @repo/bot build && \
    yarn workspaces focus @repo/bot --production

FROM node:20-alpine
WORKDIR /application
COPY --from=builder /application/apps/bot/dist ./
COPY --from=builder /application/apps/bot/.migrations ./.migrations
COPY --from=builder /application/node_modules ./node_modules
ENTRYPOINT ["node", "/application/index.cjs"]