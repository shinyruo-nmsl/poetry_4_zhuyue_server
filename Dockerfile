FROM  node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install -g npm@10.8.2

COPY . .

RUN npm run tsc

EXPOSE 3333

CMD [ "npm", "run", "start:prod"  ]