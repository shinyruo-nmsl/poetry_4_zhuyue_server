FROM --platform=linux/amd64 node:latest

WORKDIR /app

COPY package*.json ./

RUN  rm -rf node_modules package-lock.json

RUN  npm install 

COPY . .

RUN npm run tsc

EXPOSE 3333

CMD [ "npm", "run", "start:prod"  ]