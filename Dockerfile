FROM node:18.18-alpine3.18

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3006

CMD [ "npm", "start" ]