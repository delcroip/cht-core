FROM node:16 AS build-stage
WORKDIR /build
COPY ./ ./
RUN npm install 
RUN npm ci 
RUN npm install -g grunt-cli
 
RUN  node --stack_size=10000 `which grunt` build-dev

FROM alpine:3.15 AS base_build

RUN apk add --update --no-cache \
  build-base \
  curl \
  nodejs~=16 \
  npm~=8 \
  tzdata \
  libxslt \
  bash \
  jq

WORKDIR /service

COPY --from=build-stage /build/package.json /build/package-lock.json ./
COPY --from=build-stage /build/shared-libs ./shared-libs
COPY --from=build-stage /build/node_modules/@medic ./node_modules/@medic
COPY --from=build-stage /build/api ./api
RUN  cd api && npm install


ENV NODE_PATH=/service/api/node_modules

ENTRYPOINT ["/bin/bash", "/service/api/docker-entrypoint.sh", "main"]
