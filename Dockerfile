FROM node:14

RUN apt-get update && apt-get install -y python make g++

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 3000

CMD ["node", "src/index.js"]
