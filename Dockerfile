FROM --platform=linux/amd64 node:latest

WORKDIR /app

COPY package*.json ./

RUN npm cache clean --force

RUN npm install 

COPY . .

RUN npm run tsc

EXPOSE 3333

CMD [ "npm", "run", "start:prod"  ]