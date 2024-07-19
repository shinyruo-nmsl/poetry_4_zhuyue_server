FROM  --platform=arm64 node:latest

WORKDIR /app

COPY package*.json ./

ENV NODE_ENV=production

RUN npm install

COPY . .

RUN npm run tsc

EXPOSE 3333

CMD [ "npm", "run", "start:prod"  ]