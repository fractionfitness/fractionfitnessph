# syntax=docker/dockerfile:1

# 1ST STAGE
FROM node:18.13-bullseye-slim as builder

# dumb-init binary will be copied in the 2nd build stage
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

WORKDIR '/app/client'
COPY --link ./client .
RUN npm install
RUN npm run build:prod

# 2ND STAGE
FROM node:18.13-bullseye-slim
ENV NODE_ENV production

# copy dumb-init binary from 1st stage
COPY --link --chown=node:node --from=builder /usr/bin/dumb-init /usr/bin

WORKDIR '/app/client/dist'
COPY --link --chown=node:node --from=builder /app/client/dist .

WORKDIR '/app/api'
# script is for initializing the empty postgres dev db, using prisma
COPY --link --chown=node:node ./scripts/init_postgres_dev.sh .
# make file executable
RUN chmod u+x ./init_postgres_dev.sh

COPY --link --chown=node:node ./api .
RUN npm ci --only=production
USER node
EXPOSE 5000

# dumb-init will be set as process 0 as node doesn't behave well if it is process 0
CMD ["dumb-init", "node", "index.js"]