FROM node:lts-alpine as build

WORKDIR /usr/src/app

COPY package.json .

COPY yarn.lock .

RUN yarn install --only=Production

COPY . .

RUN npx prisma generate

RUN yarn build

#---------------------------------------------------------------------------------------
FROM node:lts-slim

RUN apt update && apt install libssl-dev dumb-init -y --no-install-recommends

RUN apt-get update && apt-get install gnupg wget -y && \
    wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install google-chrome-stable -y --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY --chown=node:node --from=build /usr/src/app/dist ./dist
# COPY --chown=node:node --from=build /usr/src/app/.env .env
COPY --chown=node:node --from=build /usr/src/app/package.json .
COPY --chown=node:node --from=build /usr/src/app/yarn.lock .
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma
COPY --chown=node:node --from=build /usr/src/app/node_modules/.prisma/client  ./node_modules/.prisma/client

RUN yarn install --only=Production

CMD ["dumb-init", "yarn", "start:prod"]