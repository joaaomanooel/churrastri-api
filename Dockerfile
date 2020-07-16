FROM node:12-slim

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install --production --silent --progress=false && mv node_modules ../

COPY . .

EXPOSE 5000

CMD [ "npm", "start" ]
