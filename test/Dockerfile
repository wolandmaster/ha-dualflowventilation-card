FROM ubuntu:latest AS builder

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y npm \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workdir
COPY src /workdir/src/
COPY package.json package-lock.json /workdir/
COPY rollup.config.mjs hacs.json tsconfig.json /workdir/

RUN npm ci
RUN npm run build

FROM homeassistant/home-assistant:latest

COPY test/.storage/* /config/.storage/
COPY --from=builder /workdir/dist/dual-flow-ventilation-card.js /config/www/
