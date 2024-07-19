FROM  --platform=arm64 node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install -g tsc \&& npm install -g concurrently \ && npm install -g typescript 

COPY . .

RUN npm run tsc

EXPOSE 3333

CMD [ "npm", "run", "start:prod"  ]