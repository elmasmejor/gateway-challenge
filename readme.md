# Gateways challenge

Breve descripción de tu proyecto.

## Prerequisites

- [Node.js](https://nodejs.org) (latest)
- [PNPM](https://pnpm.io) (latest)
- [MongoDB](https://www.mongodb.com)

## Install API

1. clone this:

   ```bash
   git clone https://github.com/elmasmejor/gateway-challenge.git

2. move to api directory:
   ```bash
   cd gateways-api

3. create .env
   ```text
   APP_PORT=3000
   CONFIG_MONGODB_URL=mongodb://localhost:27017/gateways-db

4. install pnpm:
   ```bash
   npm install -g pnpm

5. install dependencies:
   ```bash
   pnpm install

6. run api:
   ```bash
   pnpm run build

7. run api:
   ```bash
   pnpm run start

## Install front

1. clone this:

   ```bash
   git clone https://github.com/elmasmejor/gateway-challenge.git

2. move to api directory:
   ```bash
   cd gateways-ui

3. create .env
   ```text
   PORT=5000
   BASE_URL=http://localhost:3000/api

4. install pnpm:
   ```bash
   npm install -g pnpm

5. install dependencies:
   ```bash
   pnpm install

6. run gui:
   ```bash
   pnpm run build
   
7. run gui:
   ```bash
   pnpm run dev