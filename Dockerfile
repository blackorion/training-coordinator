FROM node:20-alpine
WORKDIR /application
COPY yarn.lock .
COPY package.json .
COPY .yarnrc.yml .
COPY .yarn/releases ./.yarn/releases
COPY apps/bot ./apps/bot
RUN yarn workspaces focus @repo/bot && ls -la apps/bot
ENTRYPOINT yarn workspace @repo/bot dev