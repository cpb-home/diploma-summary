FROM node:20.10-alpine AS production
WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"]