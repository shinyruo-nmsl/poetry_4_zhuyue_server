FROM  node:latest

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run tsc

EXPOSE 3333

CMD [ "npm", "run", "start:prod"  ]