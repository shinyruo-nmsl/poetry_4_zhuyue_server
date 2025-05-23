FROM --platform=linux/amd64 node:18

WORKDIR /app

COPY package*.json ./

RUN  npm install 

COPY . .

RUN npm run tsc

EXPOSE 3333

CMD [ "npm", "run", "start:prod"  ]